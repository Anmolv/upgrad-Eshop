import React from 'react';
import { Button, Modal, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: 'whitesmoke',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        outline: 'none',
    },
    buttonContainer: {
        marginTop: 30,
        display: 'flex',
        justifyContent: 'end',
        gap: 10,
    },
    button: {
        minWidth: '50px',
        paddingLeft: 20,
        paddingRight: 20
    },
    lightText: {
        fontWeight: 300,
        marginBottom: 2
    }
}));

function ConfirmationModal({ isOpen, onClose, onConfirm }) {
    const classes = useStyles();

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            className={classes.modal}
        >
            <div className={classes.paper}>
                <p style={{ fontWeight: '600', paddingBottom: 10, fontSize:18 }}>Confirm deletion of product!</p>
                <p className={classes.lightText}>Are you sure you want to delete the product?</p>
                <div className={classes.buttonContainer}>
                    <Button variant="contained" color="primary" onClick={onConfirm} className={classes.button}>
                        Ok
                    </Button>
                    <Button variant="outlined" onClick={onClose} className={classes.button}>
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default ConfirmationModal;