import React, { useEffect, useState } from 'react';
import DetailReportComment from './DetailReportComment';
import { useLocation } from 'react-router-dom';
import { getDetailReportArticle, getDetailReportComment } from '../../../services/ReportService';
import { Container } from 'react-bootstrap';
import BtnViewArticle from '../../common/BtnViewArticle';
import LinkToProfile from '../../user/LinkToProfile';
import { formatDateTime2 } from '../../../untils/time-format';
import StatusReport from './StatusReport';

const DetailReport = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("reportId");
  const type = searchParams.get("type");

  const [refreshData, setRefreshData] = useState(Date.now());

  const [reportData, setReportData] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      if (type === "comment") {
        const response = await getDetailReportComment(id ? +id : -1);
        setReportData(response.data.data)
      } else if (type === "article") {
        const response = await getDetailReportArticle(id ? +id : -1);
        setReportData(response.data.data)
      }
    }

    if (id) {
      fetchData();
    }
  }, [refreshData, id]);

  return (
    <Container>
      <div className='el-card is-always-shadow'>
        {reportData && <div className='el-card__body'>
          <div className='row mb-5'>
            <div className='col-sm-1'>
              <b>Nội dung:</b>
            </div>
            <div className='col-sm-11'>
              {
                (type === "comment" ? <DetailReportComment commentId={reportData.comment.id} /> : <BtnViewArticle articleId={reportData.article.id} />)
              }
            </div>
          </div>
          <hr />
          <div className='row'>
            <div className='col-sm-1'>
              <b>Người Report:</b>
            </div>
            <div className='col-sm-11'>
              <LinkToProfile userId={reportData.author.id} userName={`${reportData.author.first_name} ${reportData.author.last_name}`} />
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-1'>
              <b>Lý do:</b>
            </div>
            <div className='col-sm-5'>
              <p style={{ color: "red" }}>
                {reportData.reason === 1 ? "Spam" : ""}
                {reportData.reason === 2 ? "Vi phạm điều khoản" : ""}
                {reportData.reason === 3 ? "Quấy rồi" : ""}
                {reportData.reason === 4 ? "Vi phạm bản quyền" : ""}
                {reportData.reason === 5 ? "Bản dịch kém chất lượng" : ""}

              </p>
            </div>
            <div className="col-sm-1">
              <b>Thời gian: </b>
            </div>
            <div className="col-sm-5">
              <p>{formatDateTime2(reportData.createdAt)}</p>
            </div>
          </div>
          <div className="row">
            <div className='col-sm-1'>
            </div>

            <div className='col-sm-11'>
              <p>{reportData.note}</p>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-1'>
              Trạng thái
            </div>
            <div className='col-sm-4'>
              {type && <StatusReport type={type as "comment" | "article"} onSubmit={setRefreshData} dataId={reportData.id} status={reportData.status} />}
            </div>
          </div>
        </div>}
      </div>
    </Container>
  )
}

export default DetailReport
