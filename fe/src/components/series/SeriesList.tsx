import Seo from '../common/SEO';
import SeriesItems from './SeriesItems';

const SeriesList = () => {
  return (
    <div>
      <Seo
        title='Series mới nhất'
        metaDescription='Danh sách series'
        metaKeywords='Series'
      />
      <SeriesItems />
    </div>
  )
}

export default SeriesList
