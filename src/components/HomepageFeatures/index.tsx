import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Support Me",
    // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Give me a star at here{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/hata33"
        >
          GitHub
        </a>
      </>
    ),
  },
  {
    title: "About Me",
    // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: <>Focus on front-end development</>,
  },
  {
    title: "Contact Me",
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: <>QQ Mail: 1553126902@qq.com</>,
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
