import {styled} from "@mui/material/styles";
import {alpha, InputBase} from "@mui/material";

// colors.js

const Colors = {
    primary: '#D6E2EB',         // Primary color for buttons and other UI elements
    primaryHover: '#1672C4',    // Hover state for primary color
    primaryActive: '#145B99',   // Active state for primary color
    accent: '#F1C0A4',          // Accent color for special actions
    accentHover: '#D9A68C',     // Hover state for accent color
    accentActive: '#BF8E75',    // Active state for accent color
    secondary: '#FFFFFF',       // Secondary color (e.g., text on buttons)
    background: '#F2F5FA',      // Background color for main containers
    textPrimary: '#D6E2EB',     // Primary text color
    textSecondary: '#14213D',   // Secondary text color
};

export const AppInputBox = styled(InputBase)(({theme}) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: '4px',
        position: 'relative',
        backgroundColor: '#ffffff',
        border: '1px solid',
        borderColor: '#007fff',
        fontSize: 16,
        //width: 'auto',
        padding: '10px 12px',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            boxShadow: `${alpha(Colors.primaryHover, 0.25)} 0 4 8 0.2rem`,
            borderColor: '1px solid #FCA311',
        },
    },
}));