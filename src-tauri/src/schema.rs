// @generated automatically by Diesel CLI.

diesel::table! {
    categories (id_category) {
        id_category -> Integer,
        #[max_length = 100]
        category_name -> Varchar,
        #[max_length = 45]
        modify_by -> Varchar,
        created_on -> Nullable<Timestamp>,
        updated_on -> Nullable<Timestamp>,
        state -> Tinyint,
    }
}

diesel::table! {
    employees (employee_identity) {
        #[max_length = 13]
        employee_identity -> Varchar,
        role_id -> Integer,
        #[max_length = 100]
        first_name -> Varchar,
        #[max_length = 45]
        last_name -> Varchar,
        #[max_length = 45]
        user_name -> Varchar,
        #[max_length = 100]
        password -> Varchar,
        state -> Tinyint,
    }
}

diesel::table! {
    inventories (id_inventory) {
        id_inventory -> Integer,
        stock_quantity -> Decimal,
        sale_with_stock -> Tinyint,
        product_id -> Integer,
    }
}

diesel::table! {
    menus (id_menu) {
        id_menu -> Integer,
        #[max_length = 100]
        title_menu -> Varchar,
        #[max_length = 100]
        route -> Varchar,
        parent_id -> Nullable<Integer>,
        state -> Tinyint,
        created_on -> Nullable<Timestamp>,
        updated_on -> Nullable<Timestamp>,
    }
}

diesel::table! {
    permissions (id_permission) {
        id_permission -> Integer,
        created_on -> Nullable<Timestamp>,
        updated_on -> Nullable<Timestamp>,
        menu_id -> Integer,
        role_id -> Integer,
    }
}

diesel::table! {
    products (id_product) {
        id_product -> Integer,
        id_unit_of_measure -> Integer,
        #[max_length = 100]
        product_name -> Varchar,
        #[max_length = 100]
        modify_by -> Varchar,
        sale_price -> Decimal,
        cost_price -> Decimal,
        created_on -> Nullable<Timestamp>,
        updated_on -> Nullable<Timestamp>,
        category_id -> Integer,
        #[max_length = 100]
        bar_code -> Varchar,
    }
}

diesel::table! {
    roles (id_role) {
        id_role -> Integer,
        #[max_length = 45]
        role_name -> Varchar,
        state -> Tinyint,
    }
}

diesel::table! {
    units_of_measure (id_unit) {
        id_unit -> Integer,
        #[max_length = 45]
        name_unit -> Varchar,
        #[max_length = 15]
        symbol -> Varchar,
    }
}

diesel::joinable!(employees -> roles (role_id));
diesel::joinable!(inventories -> products (product_id));
diesel::joinable!(permissions -> menus (menu_id));
diesel::joinable!(permissions -> roles (role_id));
diesel::joinable!(products -> categories (category_id));
diesel::joinable!(products -> units_of_measure (id_unit_of_measure));

diesel::allow_tables_to_appear_in_same_query!(
    categories,
    employees,
    inventories,
    menus,
    permissions,
    products,
    roles,
    units_of_measure,
);
