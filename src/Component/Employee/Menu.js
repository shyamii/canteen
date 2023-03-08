import { AspectRatio, BookmarkAdd } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button, Card, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import * as React from "react";
import Swal from "sweetalert2";
import { date } from "yup";

export default function Menu() {
  const [items, setItems] = React.useState([]);

  const [loggedInUser, setLoggedInUser] =  React.useState(JSON.parse(sessionStorage.getItem("User")))

  React.useEffect(() => {
    getItems();
  }, []);

  const getLatestUserInfo = () => {
    axios
      .get("http://localhost:3333/Employees/" + loggedInUser.id)
      .then((response) => {
          sessionStorage.setItem("User", JSON.stringify(response.data));
          setLoggedInUser(response.data)
      })
      .catch((error) => {
        console.log(error)
      });
  };

  const getItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3333/items?quantity_gte=1"
      );
      setItems(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const reduceItemQuantityByOne = (item) => {
    axios
      .put("http://localhost:3333/items/" + item.id, {
        name: item.name,
        price: item.price,
        quantity: item.quantity - 1,
      })
      .then((response) => {
        // getItems();
      });
  };

  const addTransaction = (item) => {
    axios
      .post("http://localhost:3333/transactions/", {
        employeeID: loggedInUser.id,
        eventTime: new Date().toDateString(),
        amount: item.price,
        name: item.name,
      })
      .then((response) => {
        // getItems();
      });
  };

  const reduceBalance = (item) => {
    axios
      .patch("http://localhost:3333/Employees/" + loggedInUser.id, {
        balance: loggedInUser.balance - item.price,
      })
      .then((response) => {
        // getItems();
        getLatestUserInfo();
      });
  };

  const buyClickHandler = (item) => {
    reduceItemQuantityByOne(item);
    setTimeout(function() {
      addTransaction(item);
    }, 500);
    setTimeout(function() {
      reduceBalance(item);
    }, 500);
  
  };

  const buyForEmployeeHandler = ()=>{
    Swal.fire({
      title: "Employee Update Form",
      html: `
        <input type="number" id="empId" class="swal2-input" placeholder="Enter Employee Id">
        `,
      confirmButtonText: "Update",
      focusConfirm: false,
      preConfirm: () => {
        const empId = Swal.getPopup().querySelector("#empId").value;
        if (!empId) {
          Swal.showValidationMessage(
            `Please enter empId`
          );
        }
        return { empId };
      },
    }).then((result) => {
      console.log(result.value);
      axios
        .put(
          "http://localhost:3333/Employees/", result.value
        )
        .then((response) => {
          Swal.fire("Updated!", "Employee data Updated.", "success");
          // getEmployeesData()
        })
        .catch((e) => {
          Swal.fire(
            "Something went wrong!",
            "Employee data not found.",
            "failed"
          );
        });
    });
  }

  return (
    <Box
      component="ul"
      sx={{ display: "flex", gap: 2, flexWrap: "wrap", p: 0, m: 0 }}
    >
      {items.map((item) => (
        <Card variant="outlined" sx={{ width: 320 }} key={item.id}>
          <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
            {item.name}
          </Typography>
          <Typography level="body2">Item Description</Typography>
          {/* <AspectRatio minHeight="120px" maxHeight="200px" sx={{ my: 2 }}>
          <img
            src=""
            alt={item.name}
          />
        </AspectRatio> */}
          <Box sx={{ display: "flex" }}>
            <div>
              <Typography level="body3">Price:</Typography>
              <Typography fontSize="lg" fontWeight="lg">
                {item.price}
              </Typography>
            </div>

            {loggedInUser && loggedInUser.role === "admin" && (
              <Button
                variant="solid"
                size="sm"
                color="primary"
                aria-label="Explore Bahamas Islands"
                sx={{ ml: "auto", fontWeight: 600 }}
                onClick={() => buyForEmployeeHandler(item)}
              >
                Buy for employee
                <ShoppingCartIcon />
              </Button>
            )}
            <Button
              variant="solid"
              size="sm"
              color="primary"
              aria-label="Explore Bahamas Islands"
              sx={{ ml: "auto", fontWeight: 600 }}
              onClick={() => buyClickHandler(item)}
            >
              Buy
              <ShoppingCartIcon />
            </Button>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
