import React from "react";
import styles from "./simulation.module.scss";

const SimulationPage = () => {
  return (
    <div className={styles.div_main}>
      <div className={styles.div1}>
        <p>Simulasi Registrasi Siswa Baru</p>
        <button>Generate 50 Simulasi Siswa Baru</button>
      </div>
      <div className={styles.div1}>
        <p>Simulasi Create Guru dan staff</p>
        <button>Generate 50 Simulasi Guru</button>
      </div>
      <div className={styles.div1}>
        <p>Simulasi custom formasi Jadwal pelajaran per kelas</p>
        <button>Generate Jadwal pelajaran </button>
      </div>
    </div>
  );
};

export default SimulationPage;
