import styles from "./MainPage.module.css";
import { useSession } from "components/OT";

import LoadingPage from "components/LoadingPage";

interface MainPageProps {
  children?: any;
}

function MainPage ({ children }: MainPageProps) {
  const { isConnected } = useSession();

  if (!isConnected) {
    return <LoadingPage />
  }

  return (
    <main className={styles.main}>
      {children}
    </main>
  )
}

export default MainPage;
