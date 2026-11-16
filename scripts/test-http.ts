async function verifyHttp() {
  const routes = [
    { path: "/", expectedStatus: 200, name: "Home Page" },
    { path: "/work", expectedStatus: 200, name: "Work Catalog" },
    { path: "/work/aetherfall-aerial-combat", expectedStatus: 200, name: "Case Study Detail" },
    { path: "/about", expectedStatus: 200, name: "About Page" },
    { path: "/faq", expectedStatus: 200, name: "FAQ Page" },
    { path: "/contact", expectedStatus: 200, name: "Contact Page" },
    { path: "/admin/login", expectedStatus: 200, name: "Admin Login Page" },
    { path: "/admin", expectedStatus: 307, name: "Admin Protected Route (Redirect)", redirect: "manual" },
    { path: "/robots.txt", expectedStatus: 200, name: "Robots TXT" },
    { path: "/sitemap.xml", expectedStatus: 200, name: "Sitemap XML" }
  ];

  console.log("Testing HTTP Endpoints on http://127.0.0.1:3000...");
  let passed = 0;
  let failed = 0;

  for (const r of routes) {
    try {
      const res = await fetch(`http://127.0.0.1:3000${r.path}`, {
        redirect: (r.redirect as any) || "follow",
      });

      if (res.status === r.expectedStatus) {
        console.log(`[PASS] ${r.name} -> HTTP ${res.status}`);
        passed++;
      } else {
        console.error(`[FAIL] ${r.name} -> Expected HTTP ${r.expectedStatus}, got ${res.status}`);
        failed++;
      }
    } catch (err: any) {
      console.error(`[FAIL] ${r.name} -> Connection error: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nHTTP Summary: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) process.exit(1);
}

verifyHttp();
