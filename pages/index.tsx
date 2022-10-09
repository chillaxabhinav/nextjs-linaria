import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { css } from '@linaria/atomic';


const atomicCss = css`
  background: red;
  width: 50px;
  height: 50px;
  border: 1px solid black;
`;

const blueColor = css`
  color: blue;
`;


const Home: NextPage = () => {
  return (
    <>
      <div className={styles.container}>Hi hello</div>
      <div className={atomicCss} />
      <div className={blueColor}>Hi I am blue colour</div>
    </>
  )
}

export default Home
