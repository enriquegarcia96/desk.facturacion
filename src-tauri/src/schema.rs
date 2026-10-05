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
        category_id -> Integer,
        #[max_length = 100]
        product_name -> Varchar,
        #[max_length = 100]
        modify_by -> Varchar,
        created_on -> Nullable<Timestamp>,
        updated_on -> Nullable<Timestamp>,
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

diesel::joinable!(employees -> roles (role_id));
diesel::joinable!(permissions -> menus (menu_id));
diesel::joinable!(permissions -> roles (role_id));
diesel::joinable!(products -> categories (category_id));

diesel::allow_tables_to_appear_in_same_query!(
    categories,
    employees,
    menus,
    permissions,
    products,
    roles,
);
