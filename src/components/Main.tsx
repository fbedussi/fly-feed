import { Component, For } from 'solid-js';

import styles from './Main.module.css'
import { articles } from '../state';
import { useSearchParams } from '@solidjs/router';
import ArticleCard from './ArticleCard';

const Main: Component = () => {
  const [searchParams] = useSearchParams()
  const getFilteredArticles = () => articles().filter(({ categoryId, siteId }) => {
    const categoryMatch = searchParams.category ? categoryId === searchParams.category : true
    const siteMatch = searchParams.site ? siteId === searchParams.site : true

    return categoryMatch && siteMatch
  })

  return (
    <main class={styles.main}>
      <For each={getFilteredArticles()}>
        {({ siteId, article }) => <ArticleCard article={article} siteId={siteId} />}
      </For>
    </main>
  );
};

export default Main;
