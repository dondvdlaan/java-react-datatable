package com.manyroads.server.logic;

import org.json.JSONObject;

/**
 * This class is an assistance for the components in the eCommerce application
 */
public class helper {

    /**
     * This nethode converts a String/JSON Object paramater in to an Integer
     * @param quantity      [String/JSONobject]   : quantity o be converted
     * @return itemQuantity [int]                 : converted quantity
     */
    public  static int objectToInteger(String quantity){

        JSONObject jsonObject = new JSONObject(quantity);
        int itemQuantity = jsonObject.getInt("quantity");
        return itemQuantity;
    }
}
