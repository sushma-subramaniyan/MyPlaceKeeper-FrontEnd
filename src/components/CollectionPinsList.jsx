import { useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import "../components/CollectionPinsList.css"
import { Button } from "@mui/base";
import { IconButton, Menu, MenuItem, TextField } from "@mui/material";
import { useEffect } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import RoomIcon from '@mui/icons-material/Room';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CollectionPinsList = ({ selectedCollection, setShowComponent, setOpenSnakbar }) => {

    const [collectionPins, setCollectionPins] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPin, setSelectedPin] = useState(null);

    const fetchCollectionPins = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pincollection/${selectedCollection._id}/pins`);
            if (response.ok) {
                const data = await response.json();
                setCollectionPins(data);
            } else {
                setOpenSnakbar({ open: true, message: 'Failed to fetch data', severity: 'error' })
            }

        } catch (error) {
            console.log('Error:', error);
        }
    }

    //   const handleCollection = async () => {

    //    try {
    //      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pincollection${selectedCollection ? '/' + selectedCollection._id : ''}`, {
    //        method: selectedCollection ? 'PUT':'POST',
    //        headers: {
    //          'Content-Type': 'application/json',
    //        },
    //        body: JSON.stringify({ name: newCollectionName, user: user._id }),
    //      });

    //      if (response.ok) {
    //        // Fetch and update the collections list after creating a new collection
    //        toggleInput();
    //        await fetchCollectionPins();
    //      } else {
    //        console.log('Failed to create a new collection');
    //      }
    //    } catch (error) {
    //      console.log('Error:', error);
    //    }
    //    setInputValue('');
    //    setNewCollectionName('');
    //    setInputVisible(false);
    //    setSelectedCollection(null);
    //  };

    const handleMenuClick = (event, pin) => {
        setAnchorEl(event.currentTarget);
        setSelectedPin(pin);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedPin(null);
    };

    const handleUpdate = () => {
        // Implement your update logic here
        toggleInput();
        handleMenuClose();
    };

    const handleDelete = async () => {
        // Implement your delete logic here
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pincollection/${selectedCollection._id}/pins/${selectedPin._id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setOpenSnakbar({ open: true, message: 'Pin deleted successfully', severity: 'success' })
                await fetchCollectionPins();
            } else {
                setOpenSnakbar({ open: true, message: 'Failed to delete the pin', severity: 'error' })
            }
        } catch (error) {
            console.log('Error:', error);
        }
        handleMenuClose();
    };

    const handleClose = () => {
        setShowComponent({ collectionPinsList: false });
        selectedCollection(null);
        selectedPin(null);
    }
    useEffect(() => {
        fetchCollectionPins();
    }, []);

    const handleBack = () => {
        setShowComponent({ collection: true, collectionPinsList: false })
        selectedCollection(null);
    }
    return (
        <div className="collections-container">
            <div className="heading-container">
                <RoomIcon />
                Your Pins
            </div>


            <List dense sx={{ maxHeight: '200px', overflowY: 'auto', width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {collectionPins.map((pin) => (
                    // const labelId = `checkbox-list-secondary-label-${item}`;
                    // return (
                    <ListItem
                        key={pin._id}

                    // disablePadding
                    >
                        <ListItemButton>
                            <ListItemText primary={pin.title} />
                            <IconButton
                                aria-label="options"
                                onClick={(event) => handleMenuClick(event, pin)}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                <MenuItem onClick={handleUpdate}>Update</MenuItem>
                                <MenuItem onClick={(event) => handleDelete(event)}>Delete</MenuItem>
                            </Menu>
                        </ListItemButton>
                    </ListItem>
                ))}

            </List>
            {/* <div style={{ textAlign: 'center' }}>
          {inputVisible ? (
            <div>
            <TextField
              variant="outlined"
              size="small"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onBlur={toggleInput}
              onKeyDown={(e) => {
               if (e.key === 'Enter') {
                 handleCollection();
               }
             }}
            />
          </div>
          ) : (
            <Button 
              variant="contained"
              color="primary" 
              onClick={toggleInput}>
              +
            </Button>
          )}
        </div> */}
            <ArrowBackIcon className="backIcon" onClick={handleBack} />
            <CloseIcon className="loginCancel" onClick={handleClose} />
        </div>

    );
}

export default CollectionPinsList;