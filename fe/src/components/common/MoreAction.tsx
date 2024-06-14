import { FlagOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Tooltip } from 'antd';
import React, { useState } from 'react';
import ModalFormReport from '../Report/ModalFormReport';

interface Props {
  typeReport: "article" | "comment" | "user" | "series";
  dataId: number | undefined
}

const MoreAction: React.FC<Props> = (props) => {
  const { typeReport, dataId } = props;

  const [openReport, setOpenReport] = useState<boolean>(false);

  const handleOpen = () => {
    setOpenReport(true);
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div onClick={handleOpen}>
          <FlagOutlined />&nbsp;
          <span>Báo cáo</span>
        </div>
      ),
    },
  ]
  return (
    <>
      <ModalFormReport setOpen={setOpenReport} dataId={dataId} isOpen={openReport} type={typeReport} />
      <Dropdown menu={{ items }} placement="bottomRight">
        <MoreOutlined style={{ fontSize: "20px", marginLeft: "15px" }} />
      </Dropdown>
    </>
  )
}

export default MoreAction
