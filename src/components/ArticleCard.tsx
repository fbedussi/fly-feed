import { Component } from 'solid-js';
import { Article } from '../model';
import { Button, Card, CardActions, CardContent, Link, Typography } from '../styleguide';
import { useGetSubscriptions } from '../primitives/useGetSubscriptions';
import { useGetSitesFromSubscriptions } from '../primitives/useGetSitesFromSubscriptions';
import styles from './ArticleCard.module.css'
import { VirtualItemProps } from '@minht11/solid-virtual-container'

const ArticleCard: Component<VirtualItemProps<{ article: Article, siteId: string }>> = (props) => {
  const [subscriptions] = useGetSubscriptions()
  const getSiteName = () => useGetSitesFromSubscriptions(subscriptions()).find(({ id }) => id === props.item.siteId)?.title

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
          <Typography variant="h5" component="div" class={styles.title}>
            {props.item.article.title}
          </Typography>
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
