// CollapsibleSection.js
import React, { useState } from 'react';
import { Collapse, IconButton, Typography, Box } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const CollapsibleSection = ({ title, children }) => {
    const [open, setOpen] = useState(true);

    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <Box mb={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">{title}</Typography>
                <IconButton onClick={handleToggle}>
                    {open ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </Box>
            <Collapse in={open}>
                {children}
            </Collapse>
        </Box>
    );
};

export default CollapsibleSection;
