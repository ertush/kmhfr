import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const menuItems = [

  'All Facilities',
  'Approved Facilities',
  'New Facilities Pending Validation',
  'Updated Facilities Pending Validation',
  'Facilities Pending Approval',
  'Approved DHIS Synced Facilities',
  'Incomplete Facilities',
  'Synchronize Regulated Facilities',
  'Feedback on Facilities'


]


const renderMenuItem = (props) => {

  const { index, style } = props;

  return (

    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={menuItems[index]} />
      </ListItemButton>
    </ListItem>

  );
}

export {
  renderMenuItem
}