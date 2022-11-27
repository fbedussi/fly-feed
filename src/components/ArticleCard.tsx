import { Component } from 'solid-js';
import { Article } from '../model';
import { Card, CardActions, CardContent, Link, Typography } from '../styleguide';
import { useGetSitesFromSubscriptions } from '../primitives/useGetSitesFromSubscriptions';
import styles from './ArticleCard.module.css'
import { VirtualItemProps } from '@minht11/solid-virtual-container'
import { useGetSubscriptions } from '../primitives/db';

const ArticleCard: Component<VirtualItemProps<{ article: Article, siteId: string }>> = (props) => {
  const subscriptionsQuery = useGetSubscriptions()

  const getSiteName = () => useGetSitesFromSubscriptions(subscriptionsQuery.data).find(({ id }) => id === props.item.siteId)?.title

  const date = new Date(props.item.article.isoDate)
  return (
    <div
      style={props.style}
      class={styles.listItem}
      tabIndex={props.tabIndex}
    >
      <Card class={styles.card}>
        <CardContent class={styles.cardContent}>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {getSiteName()}
          </Typography>
          <a href={props.item.article.link} target="_blank">
            <Typography variant="h6" component="div" class="textEllipsis">
              {props.item.article.title}
            </Typography>
          </a>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {date.toLocaleString(navigator.language, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
          <Typography variant="body2" class={styles.articleContent} innerHTML={props.item.article.content} />
        </CardContent>
        <CardActions>
          <Link href={props.item.article.link} target="_blank" class={styles.readMore}>
            Read More
          </Link>
        </CardActions>
      </Card>
    </div>
  )
}

export default ArticleCard
