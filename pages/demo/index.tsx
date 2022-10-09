import type { NextPage } from 'next';

import { css } from '@linaria/atomic';

const blueBackground = css`
  color: blue;
`;


const Home: NextPage = () => {
    return (
        <>
            <div className={blueBackground}>I am demo blue</div>
        </>
    )
}

export default Home
