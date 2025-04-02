


import '@/styles/style.css'
import { UserProvider } from '@/context/UserContext';
import Header from "@/components/Header"

export default async function LocaleLayout({ children }) {

  return (
    <html>
      <body>
        <UserProvider>
          <Header />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
