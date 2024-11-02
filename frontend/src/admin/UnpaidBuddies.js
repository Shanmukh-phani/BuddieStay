import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  useMediaQuery,
  useTheme,
  styled,
  Chip,
  Button,
} from '@mui/material';


const LocationChip1 = styled(Chip)({

    // marginTop: '15px',
    fontFamily: 'Anta',
    fontSize: '18px',
    textAlign:'left',
    // backgroundColor:'#f0c674'
  });
  
const UnpaidPayments = ({ hostelId }) => {
  const [loading, setLoading] = useState(true);
  const [unpaidData, setUnpaidData] = useState([]);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Set default rows per page

  useEffect(() => {
    const fetchUnpaidPayments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/admin/unpaid-payments/${hostelId}`);
        setUnpaidData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching unpaid payments data.");
        setLoading(false);
      }
    };

    fetchUnpaidPayments();
  }, [hostelId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on change
  };

  // Use Media Query
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const openWhatsApp = (contactNumber) => {
    const message = "Hello, Can you please pay the rent for this month."; // Customize your message here
    const url = `https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank'); // Open in a new tab
  };



  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div style={{ padding: '20px' }}>

      <Typography variant="h6" gutterBottom>
      <LocationChip1 label={'Unpaid Payments for Last Three Months'}/>
      </Typography>

      {unpaidData.months.map((month, idx) => {
        // Filter unpaid buddies for the current month
        const filteredBuddies = unpaidData.unpaidBuddies.filter(buddy => buddy.month === month);
        
        // Calculate pagination
        const startIndex = page * rowsPerPage;
        const currentBuddies = filteredBuddies.slice(startIndex, startIndex + rowsPerPage);

        return (
          <div key={idx} style={{ marginBottom: '20px',marginTop:'20px'}}>
            <Typography variant="h6" style={{color:'darkcyan'}}>{month}</Typography>
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
              <Table size={isSmallScreen ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow style={{backgroundColor:'tomato',fontWeight:'bold',color:'white'}}>
                    <TableCell style={{color:'white',fontWeight:'bold'}}>Buddie Name</TableCell>
                    <TableCell style={{color:'white',fontWeight:'bold'}}>Buddie Room</TableCell>
                    <TableCell style={{color:'white',fontWeight:'bold'}}>Buddie Phone</TableCell>
                    <TableCell style={{color:'white',fontWeight:'bold'}}>Request</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentBuddies.map((buddy, index) => (
                    <TableRow key={index}>
                      <TableCell>{buddy.buddie_name}</TableCell>
                      <TableCell>{buddy.room_no}</TableCell>
                      <TableCell>{buddy.buddie_contact}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                        //   color="primary"
                        style={{backgroundColor:'darkcyan'}}
                          onClick={() => openWhatsApp(buddy.buddie_contact)}
                        >
                          Request
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredBuddies.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">No unpaid buddies for {month}.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {filteredBuddies.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredBuddies.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )}
            </TableContainer>
          </div>
        );
      })}
    </div>
  );
};

export default UnpaidPayments;
