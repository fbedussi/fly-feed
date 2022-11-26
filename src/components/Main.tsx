import { Component } from 'solid-js';

import styles from './Main.module.css'
import { articles, subscriptions } from '../state';
import { useSearchParams } from '@solidjs/router';
import ArticleCard from './ArticleCard';
import { VirtualContainer } from "@minht11/solid-virtual-container"
import { Chip } from '../styleguide';

const Main: Component = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const getSelectedCategoryName = () => {
    const selectedCategoryId = searchParams.category
    return subscriptions.categories.find(({ id }) => id === selectedCategoryId)?.name
  }

  const getSelectedSiteName = () => {
    const selectedSiteId = searchParams.site
    return subscriptions.sites
      .concat(subscriptions.categories.flatMap(({ sites }) => sites))
      .find(({ id }) => id === selectedSiteId)?.title
  }

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
      <div class={styles.selectionChips}>
        {getSelectedCategoryName() && (
          <Chip label={getSelectedCategoryName()} variant="outlined" color="primary" onDelete={() => {
            setSearchParams({ category: undefined }, { replace: true })
          }} />
        )}
        {getSelectedSiteName() && (
          <Chip label={getSelectedSiteName()} variant="outlined" color="secondary" onDelete={() => {
            setSearchParams({ site: undefined }, { replace: true })
          }} />
        )}
      </div>
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
