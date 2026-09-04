import "./globals.css";
import NavLinks from "./NavLinks";

export const metadata = {
  title: "Docket — Case Register",
  description: "Case tracking and management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <aside className="sidebar">
            <div className="brand">
              <span className="brand-mark">§</span> Docket
            </div>
            <NavLinks />
          </aside>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
