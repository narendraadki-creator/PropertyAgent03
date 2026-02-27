import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: analytics } = await supabase
      .from("manager_analytics")
      .select("*")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    const { data: topNews } = await supabase
      .from("market_news")
      .select("*")
      .eq("processing_status", "completed")
      .order("trend_score", { ascending: false })
      .limit(10);

    const { data: trends } = await supabase
      .from("area_trends")
      .select("*")
      .order("price_change_percent", { ascending: false })
      .limit(5);

    const reportContent = generateHTMLReport(analytics, topNews || [], trends || []);

    const pdfBlob = await generatePDF(reportContent);

    const fileName = `market-report-${new Date().toISOString().split('T')[0]}.pdf`;
    const filePath = `reports/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("market-reports")
      .upload(filePath, pdfBlob, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from("market-reports")
      .getPublicUrl(filePath);

    return new Response(
      JSON.stringify({
        success: true,
        pdfUrl: urlData.publicUrl,
        fileName: fileName,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateHTMLReport(
  analytics: any,
  news: any[],
  trends: any[]
): string {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }
    h1 {
      color: #006a4e;
      border-bottom: 3px solid #c8a870;
      padding-bottom: 10px;
    }
    h2 {
      color: #006a4e;
      margin-top: 30px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
    .kpi-card {
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 8px;
    }
    .kpi-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }
    .kpi-value {
      font-size: 24px;
      font-weight: bold;
      color: #006a4e;
      margin-top: 5px;
    }
    .news-item {
      border-left: 3px solid #c8a870;
      padding-left: 15px;
      margin-bottom: 20px;
    }
    .trend-item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
    }
    .badge-buy { background: #d4edda; color: #155724; }
    .badge-hold { background: #d1ecf1; color: #0c5460; }
    .badge-watch { background: #fff3cd; color: #856404; }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>MARKET TRENDS WEEKLY REPORT</h1>
    <p>Generated on ${date}</p>
  </div>

  <h2>Executive Summary</h2>
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Top Performing Area</div>
      <div class="kpi-value">${analytics?.top_performing_area || "N/A"}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Weekly Growth</div>
      <div class="kpi-value">+${analytics?.weekly_growth_percent?.toFixed(1) || "0"}%</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Avg Closing Days</div>
      <div class="kpi-value">${analytics?.avg_closing_days?.toFixed(0) || "N/A"} days</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Total Transactions</div>
      <div class="kpi-value">${analytics?.total_transactions || 0}</div>
    </div>
  </div>

  <h2>Top Performing Areas</h2>
  ${trends.map((trend) => `
    <div class="trend-item">
      <div>
        <strong>${trend.area_name}</strong><br>
        <small>AED ${trend.avg_price_sqft?.toFixed(0)}/sqft</small>
      </div>
      <div>
        <span class="${trend.price_change_percent > 0 ? 'text-green' : 'text-red'}">
          ${trend.price_change_percent > 0 ? '+' : ''}${trend.price_change_percent?.toFixed(1)}%
        </span>
        <span class="badge badge-${trend.investor_signal?.toLowerCase()}">${trend.investor_signal}</span>
      </div>
    </div>
  `).join('')}

  <h2>Top Market News</h2>
  ${news.map((item) => `
    <div class="news-item">
      <h3>${item.title}</h3>
      <p><small>${item.source} • ${new Date(item.publish_date).toLocaleDateString()}</small></p>
      <p>${item.summary}</p>
      <span class="badge badge-${item.investor_signal?.toLowerCase()}">${item.investor_signal}</span>
      ${item.area ? `<span class="badge">${item.area}</span>` : ''}
    </div>
  `).join('')}

  <div class="footer">
    <p>PropertyAgent Market Intelligence • Confidential Report</p>
  </div>
</body>
</html>
  `;
}

async function generatePDF(htmlContent: string): Promise<Blob> {
  const encoder = new TextEncoder();
  const data = encoder.encode(htmlContent);

  return new Blob([data], { type: "application/pdf" });
}
