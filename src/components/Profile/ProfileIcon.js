import * as React from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const GoldenFrame = styled('div')({
  width: 124, // Adjust the width to fit the avatar
  height: 124, // Adjust the height to fit the avatar
  borderRadius: '50%', // Ensure the frame is circular
  border: '4px solid orange', // Golden frame border
  boxSizing: 'border-box', // Include border in dimensions
  position: 'relative', // Position for overlaying badge
});

export default function ProfileIcon() {
  return (
    <Link to="/profile" className="profile-icon-link">
      <Stack direction="row" spacing={2}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="standard"
        >
          <GoldenFrame>
            <Avatar
              alt="Travis Howard"
              src="https://awomensthing.org/wp-content/uploads/2017/05/A-Womens-Thing-hedy-lamarr-ziegfeld-girl-reframed-pictures-02.jpg"
              sx={{ width: 120, height: 120 }} // Increase the width and height here
            />
          </GoldenFrame>
        </StyledBadge>
      </Stack>
    </Link>
  );
}
