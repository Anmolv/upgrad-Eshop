import React from 'react';
import './OrderPreview.css';

const OrderPreview = ({product, address}) => {
    console.log(address);
    return <>
        <div className="order-details">
            <table className="details-table">
                <tr>
                    <td className="left-column">
                        <div className="left-section">
                            <h2><b>{product.name}</b></h2>
                            <p>Quantity: {product.quantity}</p>
                            <p>Category: {product.category}</p>
                            <p>{product.description}</p>
                            <p style={{ color: 'red' }}>Total Price: ₹{product.price}</p>
                        </div>
                    </td>
                    <td className="vertical-line"></td>
                    <td className="right-column">
                        <div className="right-section">
                            <h2><b>Address Details:</b></h2>
                            <p>{address["street"]} <br/>
                            Contact Number: {address["contactNumber"]}<br/>
                            {address["landmark"]}, {address["city"]} <br/>
                            {address["state"]}<br/>
                            {address["zipcode"]}</p>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </>;
}

export default OrderPreview;