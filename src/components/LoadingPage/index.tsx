import styles from "./LoadingPage.module.css";

function LoadingPage () {
  return (
    <main className={styles.main}>
      <div className="Vlt-spinner Vlt-spinner--white" />
    </main>
  );
}

export default LoadingPage;
