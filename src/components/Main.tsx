import { Component, createEffect, createSignal } from 'solid-js'

import styles from './Main.module.css'
import {
  articles,
  scrollToTop,
  setArticles,
  setLeftDrawerOpen,
  setScrollToTop,
  setShowScrollToTop,
} from '../state'
import { useSearchParams } from '@solidjs/router'
import ArticleCard from './ArticleCard'
import { VirtualContainer } from '@minht11/solid-virtual-container'
import { Chip } from '../styleguide'
import { useGetSavedArticles, useGetSubscriptions } from '../primitives/db'
import { onSwipe } from '../libs/swipe'

const Main: Component = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const subscriptionsQuery = useGetSubscriptions()

  const getSelectedCategoryName = () => {
    const selectedCategoryId = searchParams.category
    return subscriptionsQuery.data?.categories.find(({ id }) => id === selectedCategoryId)?.name
  }

  createEffect(() => {
    if (!getSelectedCategoryName()) {
      setSearchParams({ category: undefined })
    }
  })

  const getSelectedSiteName = () => {
    const selectedSiteId = searchParams.site,
      sites = subscriptionsQuery.data?.categories.flatMap(({ sites }) => sites),
      site = sites?.find(({ id }) => id === selectedSiteId)
    return site?.title
  }

  createEffect(() => {
    if (!getSelectedSiteName()) {
      setSearchParams({ site: undefined })
    }
  })

  const articleQuery = useGetSavedArticles()
  createEffect(() => {
    if (articleQuery.data) {
      setArticles(articleQuery.data)
    }
  })

  const getFilteredArticles = () =>
    articles()
      .filter(({ categoryId, siteId }) => {
        const categoryMatch = searchParams.category ? categoryId === searchParams.category : true
        const siteMatch = searchParams.site ? siteId === searchParams.site : true

        return categoryMatch && siteMatch
      })
      .sort((a1, a2) => {
        const t1 = new Date(a1.article.isoDate || 0).getTime()
        const t2 = new Date(a2.article.isoDate || 0).getTime()
        return t2 - t1
      })

  let scrollTargetElement: HTMLDivElement | undefined

  createEffect(() => {
    if (scrollToTop() && scrollTargetElement) {
      scrollTargetElement.scrollTop = 0
      setScrollToTop(false)
    }
  })

  const scrollToTopWhenSelectionChanges = () => {
    if (scrollTargetElement) {
      getSelectedSiteName()
      getSelectedCategoryName()
      scrollTargetElement.scrollTop = 0
    }
  }
  createEffect(scrollToTopWhenSelectionChanges)

  const [colWidth, setColWidth] = createSignal(window.innerWidth)
  const updateColWidth = () => {
    if (scrollTargetElement) {
      const availableWidth = scrollTargetElement.clientWidth - 16
      const colWidth =
        availableWidth < 700
          ? window.innerWidth
          : availableWidth < 1400
          ? Math.floor(availableWidth / 2)
          : Math.floor(availableWidth / 3)
      setColWidth(colWidth)
    }
  }
  createEffect(updateColWidth)
  createEffect(() => {
    window.addEventListener('resize', updateColWidth)
  })

  // https://www.solidjs.com/guides/typescript#use___
  false && onSwipe

  return (
    <main
      use:onSwipe={direction => {
        if (direction === 'right') {
          setLeftDrawerOpen(true)
        }
      }}
      class={styles.main}
      ref={scrollTargetElement}
      onScroll={e => {
        if (e.currentTarget.scrollTop > 1000) {
          setShowScrollToTop(true)
        } else {
          setShowScrollToTop(false)
        }
      }}
    >
      <div class={styles.selectionChips}>
        {getSelectedCategoryName() && (
          <Chip
            class="textEllipsis"
            label={getSelectedCategoryName()}
            variant="outlined"
            sx={{ maxWidth: '50%' }}
            color="primary"
            onDelete={() => {
              setSearchParams({ category: undefined }, { replace: true })
            }}
          />
        )}
        {!!getSelectedSiteName() && (
          <Chip
            class="textEllipsis"
            label={getSelectedSiteName()}
            variant="outlined"
            sx={{ maxWidth: '50%' }}
            color="secondary"
            onDelete={() => {
              setSearchParams({ site: undefined }, { replace: true })
            }}
          />
        )}
      </div>
      <VirtualContainer
        items={getFilteredArticles()}
        scrollTarget={scrollTargetElement}
        itemSize={{
          height: 300,
          width: colWidth(),
        }}
        crossAxisCount={measurements =>
          Math.floor(measurements.container.cross / measurements.itemSize.cross)
        }
      >
        {ArticleCard}
      </VirtualContainer>
    </main>
  )
}

export default Main
