import { Component } from 'solid-js';
import { Article } from '../model';
import { Button, Card, CardActions, CardContent, Typography } from '../styleguide';
import { useGetSubscriptions } from '../primitives/useGetSubscriptions';
import { useGetSitesFromSubscriptions } from '../primitives/useGetSitesFromSubscriptions';
import styles from './ArticleCard.module.css'


const ArticleCard: Component<{ article: Article, siteId: string }> = (props) => {
  const [subscriptions] = useGetSubscriptions()
  const getSiteName = () => useGetSitesFromSubscriptions(subscriptions()).find(({ id }) => id === props.siteId)?.title

  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {getSiteName()}
        </Typography>
        <Typography variant="h5" component="div">
          {props.article.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {props.article.isoDate}
        </Typography>
        <Typography variant="body2">
          <div class={styles.articleContent} innerHTML={props.article.content} />
        </Typography>
      </CardContent>
      <CardActions>
        <a href={props.article.link} target="_blank">
          <Button size="small">Read More</Button >
        </a>
      </CardActions>
    </Card>
  )
}

export default ArticleCard
