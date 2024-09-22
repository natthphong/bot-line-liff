import Head from "next/head";
import packageJson from "../package.json";
import liff from "@line/liff";
import Link from "next/link";

export default function Home(props) {
  /** You can access to liff and liffError object through the props.
   *  const { liff, liffError } = props;
   *  console.log(liff.getVersion());
   *
   *  Learn more about LIFF API documentation (https://developers.line.biz/en/reference/liff)
   **/
  const { liff, liffError } = props;
    if (!liff){
        return <div>Loading</div>;
    }
    if (liffError ) {
        return <div>Error: {liffError.message}</div>;
    }
    console.log(liff.getAccessToken());
  // console.log(liff.getIDToken())
  // console.log(liff.getProfile())

  return (
    <div>
      <Head>
        <title>LIFF Starter {liff.getAccessToken()}</title>
      </Head>
      <div className="home">
        <h1 className="home__title">
          Welcome to <br/>
          <a
              className="home__title__link"
              href="https://developers.line.biz/en/docs/liff/overview/"
          >
            LIFF Starter!
          </a>
        </h1>
        <div className="home__badges">
          <span className="home__badges__badge badge--primary">
            LIFF Starter
          </span>
          <span className="home__badges__badge badge--secondary">nextjs</span>
          <span className="home__badges__badge badge--primary">
            {packageJson.version}
          </span>
          <a
              href="https://github.com/line/line-liff-v2-starter"
              target="_blank"
              rel="noreferrer"
              className="home__badges__badge badge--secondary"
          >
            GitHub
          </a>
        </div>
        <img
            style={{
              width: '400px',
              height: 'auto',
              border: '2px solid #333',
              boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)',
              borderRadius: '10px'
            }}
            src="https://api.omise.co/charges/chrg_test_6163go0dwvrc6e972fr/documents/docu_test_6163go2a0lhx7oprhrs/downloads/BB6A65CC7349D9CF"
            alt="bill"/>
        <div className="home__buttons">
          <nav
              rel="noreferrer"
              className="home__buttons__button button--primary">
            <Link href="/about">Go to About Page</Link>
          </nav>


        </div>
      </div>
    </div>
  );
}
