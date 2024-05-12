import { useContext, useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { AuthContext } from "../../common/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, CircularProgress, TextField, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

//Toasts
import { SuccessToast, ErrorToast } from "../../common/Toasts/Toasts";
import { ToastContainer } from "react-toastify";

//MUI Components
import MuiButtonSubmitButton from "../../common/MuiButtonSubmitButton";
import Api from '../../common/Api';
import "./AddUpdateProduct.css";
import Navbar from "../../common/navbar/NavBar";

function AddUpdateProduct() {
  const { authToken, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id !== undefined;
  const [name, setName] = useState("");
  const [category, setCategory] = useState();
  const [manufacturer, setManufacturer] = useState("");
  const [availableItems, setAvailableItems] = useState();
  const [price, setPrice] = useState();
  const [imageUrl, setImageUrl] = useState(null);
  const [productDescription, setProductDescription] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  const [nameError, setNameError] = useState(false);
  const [manufacturerError, setManufacturerError] = useState(false);
  const [availableItemsError, setAvailableItemsError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  const [dataLoading, setDataLoading] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // 获取商品分类列表
    axios
      .get("http://localhost:8080/api/products/categories", {
        headers: {
          Authorization:`Bearer ${authToken}`,
        },
      })
      .then(function (response) {
        setCategoryList(response.data);
      })
      .catch(function () {
        ErrorToast("Error: There was an issue in retrieving categories list.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEditMode) {
      // 如果是编辑模式，获取商品信息
      setDataLoading(true);
      axios
        .get(`http://localhost:8080/api/products/${id}`, {
          headers: {
            Authorization:`Bearer ${authToken}`,
          },
        })
        .then((response) => {
          const data = response.data;
          setName(data.name);
          const categoryName = data.category;
          setCategory({ label: categoryName, value: categoryName });
          setManufacturer(data.manufacturer);
          setAvailableItems(data.availableItems);
          setPrice(data.price);
          setImageUrl(data.imageUrl);
          setProductDescription(data.description);
        })
        .catch(() =>
          ErrorToast("Error: There was an issue in retrieving product details.")
        )
        .finally(() => setDataLoading(false));
    }
  }, [isEditMode, id, authToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setNameError(false);
    setManufacturerError(false);
    setAvailableItemsError(false);
    setPriceError(false);

    // 检查表单字段是否为空
    if (name === "") {
      setNameError(true);
    }
    if (manufacturer === "") {
      setManufacturerError(true);
    }
    if (availableItems === "") {
      setAvailableItemsError(true);
    }
    if (price === "") {
      setPriceError(true);
    }

    // 如果表单字段都不为空，则提交表单
    if (name && manufacturer && category?.value && availableItems && price) {
      if (isEditMode) {
        // 编辑商品信息
        axios
          .put(
            `http://localhost:8080/api/products/${id}`,
            {
              name: name,
              category: category.value,
              manufacturer: manufacturer,
              availableItems: availableItems,
              price: price,
              imageUrl: imageUrl,
              description: productDescription,
            },
            {
              headers: {
                Authorization:`Bearer ${authToken}`,
              },
            }
          )
          .then(function () {
            SuccessToast(`Product ${name} modified successfully`);
            <ToastContainer/>
            navigate("/products");
          })
          .catch(function () {
            ErrorToast(
              `Error: There was an issue is modifying product ${name}.`
            );
          });
      } else {
        // 添加新商品
        try {
          const response = await Api.post(
            "/products",
            {
              name: name,
              category: category.value,
              manufacturer: manufacturer,
              availableItems: availableItems,
              price: price,
              imageUrl: imageUrl,
              description: productDescription,
            }
          );
        
          if (response.status === 201) {
            SuccessToast(`Product ${name} added successfully`);
            // navigate('/products');
          } else if (response.status === 401) {
            ErrorToast(`Error: There was an issue in adding product: ${name}.`);
          } else {
            ErrorToast(`Error: Unexpected status code ${response.status}`);
          }
        } catch (error) {
          ErrorToast(`Error: There was an issue in adding product: ${name}.`);
        }
            // {
            //   headers: {
            //     Authorization:`Bearer ${authToken}`,
            //   },
            // }
      }
    }
  };

  const handleDelete = () => {
    // 删除商品
    axios
      .delete(`http://localhost:8080/api/products/${id}`, {
        headers: {
          Authorization:`Bearer ${authToken}`,
        },
      })
      .then(() => {
        SuccessToast(`Product deleted successfully!`);
        navigate("/products");
      })
      .catch(() => {
        ErrorToast(`Error: There was an issue in deleting the product.`);
      });
  };

  const handleDeleteConfirmation = () => {
    setConfirmDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    setConfirmDeleteDialogOpen(false);
    // 确认删除商品
    handleDelete();
  };

  return (
    <div>
      <Navbar />
      <div className="addEditContainer">
        {dataLoading ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <Typography gutterBottom variant="h5" component="p" sx={{ mb: 3 }}>
              {isEditMode ? "Modify Product" : "Add Product"}
            </Typography>
            <TextField
              label="Name"
              onChange={(e) => setName(e.target.value)}
              required
              variant="outlined"
              type="text"
              sx={{ mb: 3 }}
              fullWidth
              value={name}
              error={nameError}
            />
            <div style={{ marginBottom: "30px" }}>
              <CreatableSelect
                className="basic-single"
                classNamePrefix="select"
                name="category"
                isClearable
                required
                options={categoryList.map((item) => ({
                  label: item,
                  value: item,
                }))}
                value={category}
                onChange={(data) => setCategory(data)}
              />
            </div>
            <TextField
              label="Manufacturer"
              onChange={(e) => setManufacturer(e.target.value)}
              required
              variant="outlined"
              type="text"
              sx={{ mb: 3 }}
              fullWidth
              value={manufacturer}
              error={manufacturerError}
            />
            <TextField
              label="Available Items"
              onChange={(e) => setAvailableItems(e.target.value)}
              required
              variant="outlined"
              type="number"
              sx={{ mb: 3 }}
              fullWidth
              value={
                availableItems !== undefined
                  ? Number(availableItems)
                  : availableItems
              }
              error={availableItemsError}
            />
            <TextField
              label="Price"
              onChange={(e) => setPrice(e.target.value)}
              required
              variant="outlined"
              type="number"
              value={price !== undefined ? Number(price) : price}
              error={priceError}
              fullWidth
              sx={{ mb: 3 }}
            />
            <TextField
              label="Image URL"
              onChange={(e) => setImageUrl(e.target.value)}
              variant="outlined"
              type="text"
              sx={{ mb: 3 }}
              fullWidth
              value={imageUrl}
            />
            <TextField
              label="Product Description"
              onChange={(e) => setProductDescription(e.target.value)}
              variant="outlined"
              type="text"
              sx={{ mb: 3 }}
              fullWidth
              value={productDescription}
            />
            <MuiButtonSubmitButton
              value={isEditMode ? "Modify Product" : "Save Product"}
            />
            {/* <ToastContainer/> */}
            {isEditMode && isAdmin && (
              <>
                {/* 添加删除按钮，并绑定确认删除函数 */}
                <Button onClick={handleDeleteConfirmation}>Delete Product</Button>
                {/* 确认删除对话框 */}
                <Dialog
                  open={confirmDeleteDialogOpen}
                  onClose={handleDeleteCancel}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Confirm deletion of product! Are you sure want to delete the product?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} autoFocus>
                      OK
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default AddUpdateProduct;
