import { Component } from 'solid-js'
import { Article } from '../model'
import {
  Card,
  CardContent,
  IconButton,
  Link,
  StarBorderIcon,
  StarIcon,
  Typography,
} from '../styleguide'
import { useGetSitesFromSubscriptions } from '../primitives/useGetSitesFromSubscriptions'
import styles from './ArticleCard.module.css'
import { VirtualItemProps } from '@minht11/solid-virtual-container'
import { useDeleteArticle, useGetSubscriptions, useSaveArticle } from '../primitives/db'

const ArticleCard: Component<
  VirtualItemProps<{ article: Article; siteId: string; categoryId: string }>
> = props => {
  const subscriptionsQuery = useGetSubscriptions()

  const getSiteName = () =>
    useGetSitesFromSubscriptions(subscriptionsQuery.data).find(({ id }) => id === props.item.siteId)
      ?.title

  const date = new Date(props.item.article.isoDate)

  const saveArticleMutation = useSaveArticle()
  const deleteArticleMutation = useDeleteArticle()

  return (
    <div style={props.style} class={styles.listItem} tabIndex={props.tabIndex}>
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
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
          <div
            classList={{
              [styles.imageAndText]: true,
              [styles.oneColumn]: !props.item.article.images,
            }}
          >
            <div class={styles.text}>
              <Typography
                variant="body2"
                class={styles.articleContent}
                innerHTML={props.item.article.content}
              />
            </div>
            {!!props.item.article.images && (
              <div class={styles.imageWrapper} innerHTML={props.item.article.images[0]} />
            )}
          </div>
        </CardContent>
        <div class={styles.cardActions}>
          <Link href={props.item.article.link} target="_blank" class={styles.readMore}>
            Read More
          </Link>
          {props.item.article.saved ? (
            <IconButton onClick={() => deleteArticleMutation.mutate(props.item)}>
              <StarIcon />
            </IconButton>
          ) : (
            <IconButton onClick={() => saveArticleMutation.mutate(props.item)}>
              <StarBorderIcon />
            </IconButton>
          )}
        </div>
      </Card>
    </div>
  )
}

export default ArticleCard
