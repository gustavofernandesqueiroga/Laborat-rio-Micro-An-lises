import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import cron from "node-cron";
import { initializeApp as initAdmin, getApps as getAdminApps } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const firebaseConfig = JSON.parse(readFileSync(path.join(__dirname, "firebase-applet-config.json"), "utf-8"));

// Initialize Firebase Admin for backend (bypasses security rules)
let adminApp;
if (!getAdminApps().length) {
  adminApp = initAdmin({
    projectId: firebaseConfig.projectId,
  });
} else {
  adminApp = getAdminApps()[0];
}
const adminDb = getAdminFirestore(adminApp, (firebaseConfig as any).firestoreDatabaseId || '(default)');

// Initialize Firebase Client for backend (if needed for other things, but cron will use admin)
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(firebaseApp, (firebaseConfig as any).firestoreDatabaseId);

// Middleware to verify Firebase Auth ID Token using firebase-admin
export const requireAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Acesso não autorizado. Cabeçalho de autorização ausente ou inválido (Formato: Bearer <ID_TOKEN>)."
    });
  }

  const idToken = authHeader.substring(7); // "Bearer " length is 7
  try {
    const decodedToken = await getAdminAuth(adminApp).verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error: any) {
    console.error("Falha ao verificar token com Firebase Admin:", error.message);
    return res.status(403).json({
      error: "Acesso proibido. O token enviado é inválido ou expirou."
    });
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  apiVersion: "2025-01-27.acacia" as any,
});

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT) || 587,
  secure: Number(process.env.NODEMAILER_PORT) === 465,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // ... (rest of the existing code)

  // Webhook needs raw body for signature verification
  app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name;

      console.log(`Payment successful for ${customerEmail}`);

      // Send confirmation email
      if (customerEmail) {
        await sendConfirmationEmail(customerEmail, customerName || "Cliente");
      }
    }

    res.json({ received: true });
  });

  app.use(express.json());

  // Gemini API Chat Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API Key not configured on server." });
      }

      const userAgent = req.headers["user-agent"] || "";
      const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);

      let systemInstruction = `Você é o Jajá AI UX & Legal, Especialista Sênior em UI/UX e Compliance Jurídico da Coleta Já em João Pessoa, PB. 
        Sua missão é construir o futuro da saúde com segurança, design e conformidade total com a LGPD.

        1. ROTEIRO DE UI/UX (PAGAMENTO):
        - Hierarquia Visual: QR Code Pix (via Stripe) centralizado, grande e arredondado. Botão 'Copiar Código Pix' em Verde Jajá.
        - Barra de Progresso: Jajá correndo sobre a linha (Carrinho → Dados → Pagamento).
        - Sidebar de Confiança: Selos de Velocidade (Verde/Azul/Ouro) e Lica garantindo 'Transação Criptografada'.
        - Validação: Tuca confirma o sucesso do QR Code.
        - Pagamentos Mobile: Usuários podem pagar via Pix (comprovante validado em totem), Cartão (até 3x sem juros) ou Boleto. Guepardos aceitam dinheiro (informe o valor recebido para calcular troco) ou cartão na hora com maquininha.

        2. CONFORMIDADE LGPD:
        - Consentimento: Checkbox clara para Termos e Privacidade (RDC 786/2023).
        - Minimização: Apenas dados essenciais para coleta e processamento de pagamentos.
        - Transparência: Dados criptografados, direito ao esquecimento via App.

        3. ESTRATÉGIA DE RETENÇÃO & AGENDAMENTO:
        - Prioridade Guepardo: Agendamento em até 2h para urgências.
        - Recuperação: Protocolos 'O Pulo do Guepardo' (Abandono) e 'Saudades do Jajá' (Inativo).

        DIRETRIZES:
        - Tom: Ágil, profissional, ético e moderno (Holding Queiroga).
        - Humanização: Use a Turma do Jajá para explicar processos técnicos.
        - Restrições: NUNCA forneça diagnósticos ou sugira tratamentos.
        - Assinatura obrigatória: "Jajá AI UX & Legal - Construindo o futuro da saúde com segurança e design. Que Deus proteja seus dados e sua vida!"`;

      if (isMobile) {
        systemInstruction += `\n\n[OTIMIZAÇÃO COMPACTA PARA SMARTPHONE]: O usuário solicitante está acessando por celular. Siga estritamente estas diretrizes de legibilidade para telas de smartphone:
        - Use marcadores curtos e objetivos (tópicos com bullet points como 🐆, 🧪, 📍, 💳, 🔒).
        - Evite parágrafos longos! Limite-se a parágrafos de no máximo 2 ou 3 linhas curtas.
        - Divida os tópicos com títulos pequenos em negrito.
        - Mantenha a resposta extremamente direta e visualmente limpa para uma tela de 5 a 6 polegadas.`;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        systemInstruction,
      });

      const chat = model.startChat({
        history: history || [],
      });

      const lastMessage = messages[messages.length - 1].text;
      const result = await chat.sendMessage(lastMessage);
      const response = await result.response;
      const text = response.text();

      res.json({ text });
    } catch (error: any) {
      console.error("Chat Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin AI Advisor Route
  app.post("/api/admin/advisor", async (req, res) => {
    try {
      const { question } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      const systemInstruction = `Você é o Jajá AI UX & Legal, Consultor Tributário e Trabalhista Sênior da Coleta Já e da Holding Queiroga (João Pessoa, PB).
      Sua função é fornecer análises profundas, de alta credibilidade, sobre leis trabalhistas brasileiras (CLT), RDC 786/2023, LGPD, planejamento tributário (Substituição Tributária, split de notas fiscais, Simples Nacional vs Lucro Presumido para laboratórios e Guepardos) e blindagem contra cobranças indevidas de impostos estaduais ou federais.
      Sempre apresente respostas extremamente profissionais, ricas em referências de leis brasileiras e de viabilidade comercial. No rodapé, ofereça o botão de envio de Alerta de Risco Urgente para o WhatsApp de Gustavo Queiroga (83 99986-9045).`;

      if (!apiKey) {
        return res.json({
          text: `### Jajá AI UX & Legal - Consultor Tributário Sênior da Coleta Já 🐆\n\nA chave da API do Gemini será configurada em breve pelo painel de controle. Com base nas diretrizes fiscais e no planejamento tributário recomendados para a **Coleta Já** e a **Holding Queiroga** em João Pessoa/PB, eis o diagnóstico profissional compilado:\n\n1. **Blindagem de Insumos e Logística Descentralizada (Impostos e Tributos)**:\n   - **Alternativa Recomendada**: Segregação de atividades. A Coleta Já deve operar como prestadora de serviços auxiliares de apoio diagnóstico (CNAE 8640-2/02), aplicando o imposto correspondente sobre serviços (ISSQN) descentralizado. O material e os insumos de biosegurança (agulhas BD, tubos EDTA) adquiridos pela holding devem circular com notas de "Remessa para testes", isentas de ICMS interestadual com base no Convênio ICMS 15/91.\n   - **Split Fiscal Automático**: O pagamento coletado via gateway será bipartido na origem. A fatura do laboratório parceiro (ex: Micro Análises) emite nota de exames clínicos, enquanto a Coleta Já cobra exclusivamente a taxa de conveniência logística domiciliar, minimizando absurdamente a base de cálculo tributária.\n\n2. **Compliance Jurídico com Coletores (Guepardos)**:\n   - **Vínculo Empregatício (CLT) Evitado**: Os Guepardos atuam como profissionais autônomos ou microempreendedores (MEI) com total autonomia de agenda e posse dos próprios instrumentos. Para garantir blindagem jurídica imediata perante a legislação trabalhista brasileira (Art. 442-B da CLT):\n     - Evite subordinação direta e cumprimento obrigatório de escalas horizontais.\n     - Utilize remuneração por produtividade logística direta sem salário fixo.\n\n3. **LGPD e RDC 786/2023**:\n   - Triagem das amostras clínicas dentro do prazo máximo de coleta (decentramento logístico via EAL) garante integridade biológica, evitando processos de negligência profissional.\n\n*Assinatura: Jajá AI UX & Legal - Inteligência Fiscal e Operacional Corporativa.*`
        });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        systemInstruction
      });

      const result = await model.generateContent(question || "Como blindar a Coleta Já tributariamente?");
      const response = await result.response;
      res.json({ text: response.text() });
    } catch (error: any) {
      console.error("Advisor AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Generic AI Endpoint for tasks like Prescription Analysis and Address Validation
  app.post("/api/ai", async (req, res) => {
    try {
      const { task, data } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "Gemini API Key missing." });

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      let prompt = "";
      let inlineData = null;

      if (task === "analyze_prescription") {
        prompt = `Analise esta requisição médica e extraia TODOS os exames solicitados. 
        Retorne uma lista em JSON no formato: { "exams": ["Exame 1", "Exame 2"] }. 
        Ignore dados do paciente ou do médico, foque apenas nos nomes dos exames.`;
        inlineData = { data: data.base64, mimeType: data.mimeType };
      } else if (task === "analyze_prescription_full") {
        prompt = `
          Papel: Você é o Analista de Triagem da Coleta Já, especialista em leitura de requisições médicas brasileiras.
          Sua Missão: Extrair dados estruturados desta requisição médica para automatizar o agendamento de coletas domiciliares.

          Regras de Extração:
          1. Identificação do Paciente: Localize o nome completo do paciente. Geralmente está no topo do documento.
          2. Lista de Exames: Extraia o nome exato de cada exame solicitado (ex: Hemograma, Glicemia, TSH, Colesterol Total).
          3. Dados do Médico: Localize o NOME DO MÉDICO e o número do CRM. Estes dados geralmente estão no carimbo ou assinatura ao final do documento. O CRM costuma ter o formato "CRM/UF 123456" ou apenas "CRM 123456". É CRUCIAL extrair o CRM se estiver visível.
          4. Preparo Sugerido: Com base nos exames identificados, indique o tempo de jejum necessário seguindo padrões laboratoriais brasileiros (ex: 8h, 12h ou sem jejum).

          Importante: Se algum dado não for encontrado ou estiver ilegível, retorne null para aquele campo específico.

          Tom de Voz: Profissional, mas acolhedor (estilo Jajá AI).

          Retorne APENAS um objeto JSON válido com as seguintes chaves:
          {
            "patientName": "string ou null",
            "exams": ["string"],
            "doctorName": "string ou null",
            "doctorCRM": "string ou null",
            "suggestedPrep": "string"
          }
        `;
        inlineData = { data: data.base64, mimeType: data.mimeType };
      } else if (task === "validate_address") {
        prompt = `Você é um validador de endereços para o laboratório Micro Análises em João Pessoa, PB.
        O usuário informou o seguinte endereço: "${data.address}".
        
        Sua tarefa:
        1. Verifique se o endereço é válido e se está em João Pessoa ou cidades vizinhas (Cabedelo, Santa Rita, Bayeux).
        2. Sugira uma correção se o endereço estiver mal formatado ou incompleto.
        3. Responda em formato JSON com os seguintes campos:
           - "isValid": boolean (true se for na área de cobertura)
           - "suggestion": string (o endereço corrigido/formatado)
           - "reason": string (motivo se não for válido ou observação amigável)
        
        Responda APENAS o JSON.`;
      }

      const contents = [{
        role: 'user',
        parts: [
          { text: prompt },
          ...(inlineData ? [{ inlineData }] : [])
        ]
      }];

      const result = await model.generateContent({
        contents: contents as any,
        generationConfig: { responseMimeType: "application/json" }
      });
      
      const response = await result.response;
      res.json(JSON.parse(response.text()));
    } catch (error: any) {
      console.error("AI Task Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Cron Job for Reminders (runs every hour)
  cron.schedule("0 * * * *", async () => {
    console.log("Running appointment reminder cron job with Admin SDK...");
    
    try {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      // Using adminDb to bypass security rules
      const appointmentsRef = adminDb.collection("appointments");
      const snapshot = await appointmentsRef
        .where("date", "==", tomorrowStr)
        .where("reminderSent", "!=", true)
        .get();
      
      if (snapshot.empty) {
        console.log("No appointments found for reminders tomorrow.");
        return;
      }

      for (const appointmentDoc of snapshot.docs) {
        const appointment = appointmentDoc.data();
        
        try {
          await sendReminderEmail(appointment.email, appointment.name, appointment.date, appointment.time, appointment.protocolId);
          await appointmentDoc.ref.update({
            reminderSent: true
          });
          console.log(`Reminder sent to ${appointment.email} for appointment ${appointmentDoc.id}`);
        } catch (emailError) {
          console.error(`Failed to send reminder to ${appointment.email}:`, emailError);
        }
      }
    } catch (error) {
      console.error("Cron job error:", error);
    }
  });

  // API Routes
  app.get("/api/protected/me", requireAuth, async (req, res) => {
    try {
      const fbUser = (req as any).user;
      res.json({
        message: "Autenticação realizada com robustez via firebase-admin!",
        uid: fbUser.uid,
        email: fbUser.email,
        email_verified: fbUser.email_verified,
        auth_time: fbUser.auth_time,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/notify-result", requireAuth, async (req, res) => {
    try {
      const { protocol, patientName, email, phone } = req.body;

      console.log(`Iniciando notificações para o protocolo ${protocol}...`);

      // 1. Send Email
      if (email && process.env.NODEMAILER_USER && process.env.NODEMAILER_PASS) {
        await sendResultReadyEmail(email, patientName, protocol);
      }

      // 2. Send WhatsApp (Mock)
      if (phone) {
        await sendWhatsAppNotification(phone, patientName, protocol);
      }

      res.json({ success: true, message: "Notificações processadas." });
    } catch (error: any) {
      console.error("Notification Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/create-checkout-session", requireAuth, async (req, res) => {
    try {
      const { items, customerEmail } = req.body;

      const origin = process.env.APP_URL || req.headers.origin || "http://localhost:3000";

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: "brl",
            product_data: {
              name: item.name,
              description: item.description,
            },
            unit_amount: item.price * 100, // Stripe expects cents
          },
          quantity: 1,
        })),
        mode: "payment",
        customer_email: customerEmail,
        success_url: `${origin}/#/checkout?success=true`,
        cancel_url: `${origin}/#/checkout?canceled=true`,
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Email Functions
  async function sendResultReadyEmail(email: string, name: string, protocol: string) {
    console.log(`Enviando e-mail de resultado pronto para ${email}...`);
    
    const origin = process.env.APP_URL || "http://localhost:3000";
    const resultsUrl = `${origin}/#/resultados`;

    if (process.env.NODEMAILER_USER && process.env.NODEMAILER_PASS) {
      await transporter.sendMail({
        from: process.env.NODEMAILER_FROM || `"Coleta Já" <${process.env.NODEMAILER_USER}>`,
        to: email,
        subject: "Seu Resultado de Exame está Pronto! - Coleta Já",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f5f9; border-radius: 24px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0d9488; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px;">Coleta Já</h1>
            </div>
            <h2 style="color: #1e293b; text-align: center; font-size: 20px; font-weight: 800;">Olá, ${name}!</h2>
            <p style="color: #475569; text-align: center; font-size: 16px; line-height: 1.6;">
              Informamos que um ou mais exames do seu protocolo <strong>#${protocol}</strong> já estão liberados para consulta em nosso portal.
            </p>
            <div style="background-color: #f0fdfa; padding: 30px; border-radius: 20px; margin: 30px 0; border: 1px solid #ccfbf1; text-align: center;">
              <p style="margin: 0; color: #0f766e; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Protocolo</p>
              <p style="margin: 5px 0 20px 0; color: #0d9488; font-size: 32px; font-weight: 900; letter-spacing: -1px;">#${protocol}</p>
              <a href="${resultsUrl}" style="display: inline-block; background-color: #0d9488; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 15px -3px rgba(13, 148, 136, 0.3);">Acessar Resultados</a>
            </div>
            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
              <strong>Como acessar:</strong><br/>
              1. Clique no botão acima ou acesse o site da Coleta Já.<br/>
              2. Informe o número do protocolo e sua senha de acesso.<br/>
              3. Visualize ou baixe seu laudo em PDF.
            </p>
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 40px; border-top: 1px solid #f1f5f9; pt-20">
              Coleta Já - Diagnóstico Laboratorial de Precisão<br/>
              Paraíba e Rio Grande do Norte
            </p>
          </div>
        `,
      });
      console.log(`E-mail de resultado enviado para ${email}`);
    } else {
      console.log("Credenciais de e-mail não configuradas. Simulação de e-mail de resultado concluída.");
    }
  }

  async function sendWhatsAppNotification(phone: string, name: string, protocol: string) {
    console.log(`[WhatsApp Mock] Enviando notificação para ${phone}:`);
    console.log(`Olá ${name}, seu resultado do protocolo #${protocol} já está disponível no site da Coleta Já! Acesse: ${process.env.APP_URL || 'http://localhost:3000'}/#/resultados`);
    
    // Here you would integrate with Twilio or another WhatsApp API provider
    // Example with Twilio (requires accountSid, authToken, fromNumber):
    /*
    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `Olá ${name}, seu resultado do protocolo #${protocol} já está disponível no site da Coleta Já!`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phone}`
    });
    */
    return Promise.resolve();
  }

  async function sendConfirmationEmail(email: string, name: string) {
    console.log(`Enviando e-mail de confirmação para ${email}...`);
    
    if (process.env.NODEMAILER_USER && process.env.NODEMAILER_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.NODEMAILER_FROM || `"Micro Análises" <${process.env.NODEMAILER_USER}>`,
          to: email,
          subject: "Confirmação de Pagamento - Micro Análises",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h1 style="color: #0d9488; text-align: center;">Pagamento Confirmado!</h1>
              <p>Olá, <strong>${name}</strong>,</p>
              <p>Seu pagamento foi processado com sucesso. Estamos ansiosos para atendê-lo em seu agendamento.</p>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Laboratório:</strong> Micro Análises</p>
                <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Confirmado</p>
              </div>
              <p>Você receberá um lembrete 24 horas antes do seu horário marcado.</p>
              <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 30px;">
                Esta é uma mensagem automática. Por favor, não responda.
              </p>
            </div>
          `,
        });
        console.log(`E-mail de confirmação enviado para ${email}`);
      } catch (error) {
        console.error(`Erro ao enviar e-mail de confirmação para ${email}:`, error);
      }
    } else {
      console.log("Credenciais de e-mail não configuradas. Simulação concluída.");
    }
    return Promise.resolve();
  }

  async function sendReminderEmail(email: string, name: string, date: string, time: string, protocol: string) {
    console.log(`Enviando lembrete para ${email}...`);
    
    if (process.env.NODEMAILER_USER && process.env.NODEMAILER_PASS) {
      await transporter.sendMail({
        from: process.env.NODEMAILER_FROM || `"Micro Análises" <${process.env.NODEMAILER_USER}>`,
        to: email,
        subject: "Lembrete de Agendamento - Micro Análises",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h1 style="color: #0d9488; text-align: center;">Lembrete de Agendamento</h1>
            <p>Olá, <strong>${name}</strong>,</p>
            <p>Este é um lembrete amigável de que você tem um agendamento conosco amanhã.</p>
            <div style="background-color: #f0fdfa; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #ccfbf1;">
              <p style="margin: 0; color: #0f766e;"><strong>Data:</strong> ${date}</p>
              <p style="margin: 5px 0 0 0; color: #0f766e;"><strong>Horário:</strong> ${time}</p>
              <p style="margin: 5px 0 0 0; color: #0f766e;"><strong>Protocolo:</strong> ${protocol}</p>
            </div>
            <p><strong>Orientações Importantes:</strong></p>
            <ul>
              <li>Lembre-se de seguir o jejum recomendado para seus exames.</li>
              <li>Tenha em mãos seu documento de identidade e a requisição médica.</li>
              <li>Se for coleta domiciliar, nossa equipe chegará no horário previsto.</li>
            </ul>
            <p>Caso precise remarcar, entre em contato pelo nosso WhatsApp.</p>
            <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 30px;">
              Micro Análises - João Pessoa, PB
            </p>
          </div>
        `,
      });
    } else {
      console.log("Credenciais de e-mail não configuradas. Simulação de lembrete concluída.");
    }
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
