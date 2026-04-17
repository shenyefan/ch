// Auth pages use their own full-screen layout without the global Navbar/Footer
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
