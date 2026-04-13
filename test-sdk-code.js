const { PhantomAPI } = require('./packages/sdk/dist'); // بنجربه محلياً من المجلد

// المعلومات اللي إنت لسه مستخدمها في الـ CLI
const token = "vtx_0c7c26aadddfc70c1b10a545796107dab3334eabc4093e82577d02093b435b1c";
const url = "http://localhost:3000";

async function main() {
  console.log("🚀 Initializing PhantomAPI SDK...");
  
  const api = new PhantomAPI({
    apiKey: token,
    baseUrl: url
  });

  try {
    console.log("📡 Fetching secret 'MySuperKey' via Code SDK...");
    
    // أهم سطر: بنجيب السر برمجياً
    const secretValue = await api.get("MySuperKey");
    
    console.log("--------------------------------------");
    console.log(`✅ SUCCESS! The secret value is: ${secretValue}`);
    console.log("--------------------------------------");
    
    // تجربة الـ List برمجياً برضه
    const allSecrets = await api.list();
    console.log(`📦 You have ${allSecrets.length} total secrets in your PhantomAPI.`);

  } catch (error) {
    console.error("❌ SDK Error:", error.message);
  }
}

main();
