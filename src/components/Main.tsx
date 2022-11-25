import { Component, For, createEffect } from 'solid-js';

import styles from './Main.module.css'
import { articles } from '../state';
import { useSearchParams } from '@solidjs/router';
import ArticleCard from './ArticleCard';
import { VirtualContainer } from "@minht11/solid-virtual-container"
import { Article } from '../model';

const Main: Component = () => {
  const [searchParams] = useSearchParams()
  const getFilteredArticles = () => articles()
    .filter(({ categoryId, siteId }) => {
      const categoryMatch = searchParams.category ? categoryId === searchParams.category : true
      const siteMatch = searchParams.site ? siteId === searchParams.site : true

      return categoryMatch && siteMatch
    })
    .sort((a1, a2) => {
      const t1 = new Date(a1.article.isoDate).getTime()
      const t2 = new Date(a2.article.isoDate).getTime()
      return t2 - t1
    })

  let scrollTargetElement!: HTMLDivElement
  return (
    <main class={styles.main} ref={scrollTargetElement}>
      <VirtualContainer
        items={getFilteredArticles()}
        scrollTarget={scrollTargetElement}
        // Define size you wish your list items to take.
        itemSize={{ height: 300 }}
      >
        {ArticleCard as any}
      </VirtualContainer>
    </main>
  );
};

export default Main;
