import { Tooltip } from 'antd'
import React, { useState } from 'react'
import ChangeStatusReport from './ChangeStatusReport';
import { functionChange } from '../../../type';

interface Props {
  status: 1 | 2 | 3;
  dataId: number;
  onSubmit?: functionChange;
  type?: "comment" | "article";
}

const StatusReport: React.FC<Props> = (props) => {
  const { status, dataId, onSubmit, type } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div>
      <Tooltip title="Click để thay đổi status">
        <div onClick={() => setIsOpen(true)} style={{ fontSize: "12px" }} className={`d-block badge ${status === 1 ? "bg-info" : ""} 
        ${status === 2 ? "bg-warning" : ""}${status === 3 ? "bg-danger" : ""}${status === 1 ? "bg-success" : ""}`}>
          {status == 1 ? "Chưa xử lý" : ""}
          {status == 2 ? "Khóa" : ""}
          {status == 3 ? "Không vi phạm" : ""}
        </div>
      </Tooltip>
      <ChangeStatusReport onSubmit={onSubmit} dataId={dataId} isOpen={isOpen} setOpen={setIsOpen} type={type} />
    </div>
  )
}

export default StatusReport
