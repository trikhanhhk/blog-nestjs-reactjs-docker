import React from 'react'
import { TagData } from '../../../types/Tag'
import { Link } from 'react-router-dom'

interface SideBarTagProps {
  tags: TagData[];
  title: string;
  path: string
}

const SideBarTag: React.FC<SideBarTagProps> = (props: SideBarTagProps) => {
  return (
    <>
      <h5>{props.title}</h5>
      <div className="d-flex gap-2 flex-wrap">
        {props.tags && props.tags.map((tag, index) => (
          <Link key={index} to={`${props.path}?tag=${tag.id}`} className="btn btn-xs btn-light">{tag.tagName}</Link>
        ))}
      </div>
    </>
  )
}

export default SideBarTag