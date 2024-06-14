import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'

const EditButton = () => {
  return (
    <Button><FontAwesomeIcon icon={faEdit} /></Button>
  )
}

export default EditButton
