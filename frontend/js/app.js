
// ========================================
// Expense Tracker - Frontend Logic
// ========================================


// ========================================
// API URL
// ========================================

const API_URL = "http://localhost:3000/api/expenses";


// ========================================
// HTML Elements
// ========================================

const expenseForm = document.getElementById("expenseForm");

const titleInput = document.getElementById("title");

const amountInput = document.getElementById("amount");

const categoryInput = document.getElementById("category");

const dateInput = document.getElementById("date");

const expensesTableBody =
    document.getElementById("expensesTableBody");

const totalAmount =
    document.getElementById("total-amount");

const expenseCount =
    document.getElementById("expense-count");

const highestExpense =
    document.getElementById("highest-expense");

const filterCategory =
    document.getElementById("filterCategory");

const spinner =
    document.getElementById("spinner");

const alertArea =
    document.getElementById("alertArea");


// ========================================
// Store All Expenses
// ========================================

let allExpenses = [];


// ========================================
// Spinner
// ========================================

function showSpinner() {

    spinner.classList.remove("d-none");

}


function hideSpinner() {

    spinner.classList.add("d-none");

}


// ========================================
// Alert
// ========================================

function showAlert(message, type = "danger") {

    alertArea.innerHTML = `
        <div class="alert alert-${type}" role="alert">
            ${message}
        </div>
    `;

}


// ========================================
// GET - Get All Expenses
// ========================================

async function getExpenses() {

    try {

        const response = await fetch(API_URL);


        if (!response.ok) {

            throw new Error("Failed to load expenses");

        }


        const data = await response.json();


        return data;

    }

    catch (error) {

        console.error("GET expenses error:", error);


        showAlert(
            "Unable to load expenses. Please make sure the server is running."
        );


        return [];

    }

}


// ========================================
// POST - Add Expense
// ========================================

async function addExpense(data) {

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });


        const result = await response.json();


        if (!response.ok) {

            showAlert(
                result.message || "Failed to add expense."
            );

            return false;

        }


        showAlert(
            "Expense added successfully.",
            "success"
        );


        return true;

    }

    catch (error) {

        console.error("POST expense error:", error);


        showAlert(
            "Unable to add expense. Please make sure the server is running."
        );


        return false;

    }

}


// ========================================
// PUT - Update Expense
// ========================================

async function updateExpense(id, data) {

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            }
        );


        const result = await response.json();


        if (!response.ok) {

            showAlert(
                result.message || "Failed to update expense."
            );

            return false;

        }


        showAlert(
            "Expense updated successfully.",
            "success"
        );


        return true;

    }

    catch (error) {

        console.error("PUT expense error:", error);


        showAlert(
            "Unable to update expense. Please make sure the server is running."
        );


        return false;

    }

}


// ========================================
// DELETE - Delete Expense
// ========================================

async function deleteExpense(id) {

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        const result = await response.json();


        if (!response.ok) {

            showAlert(
                result.message || "Failed to delete expense."
            );

            return false;

        }


        showAlert(
            "Expense deleted successfully.",
            "success"
        );


        return true;

    }

    catch (error) {

        console.error("DELETE expense error:", error);


        showAlert(
            "Unable to delete expense. Please make sure the server is running."
        );


        return false;

    }

}


// ========================================
// Refresh
// Get fresh data from Backend
// ========================================

async function refresh() {

    try {

        showSpinner();


        allExpenses = await getExpenses();


        applyFilter();

    }

    finally {

        hideSpinner();

    }

}


// ========================================
// Render Table
// ========================================

function renderTable(list) {

    expensesTableBody.innerHTML = "";


    if (list.length === 0) {

        expensesTableBody.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="text-center text-muted"
                >
                    No expenses found.
                </td>
            </tr>
        `;

        return;

    }


    list.forEach(function (expense) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>
                ${expense.title}
            </td>

            <td>
                ${Number(expense.amount).toFixed(2)} JD
            </td>

            <td>
                <span class="badge bg-secondary">
                    ${expense.category}
                </span>
            </td>

            <td>
                ${expense.date}
            </td>

            <td>

                <button
                    class="btn btn-sm btn-warning me-1"
                    onclick="openEditModal(${expense.id})"
                >
                    <i class="bi bi-pencil"></i>
                    Edit
                </button>


                <button
                    class="btn btn-sm btn-danger"
                    onclick="handleDelete(${expense.id})"
                >
                    <i class="bi bi-trash"></i>
                    Delete
                </button>

            </td>
        `;


        expensesTableBody.appendChild(row);

    });

}


// ========================================
// Render Summary
// Always calculated from ALL expenses
// ========================================

function renderSummary() {

    const total =
        allExpenses.reduce(
            function (sum, expense) {

                return sum + Number(expense.amount);

            },
            0
        );


    const count =
        allExpenses.length;


    let highest = 0;


    if (allExpenses.length > 0) {

        highest =
            Math.max(
                ...allExpenses.map(
                    function (expense) {

                        return Number(expense.amount);

                    }
                )
            );

    }


    totalAmount.textContent =
        `${total.toFixed(2)} JD`;


    expenseCount.textContent =
        count;


    highestExpense.textContent =
        `${highest.toFixed(2)} JD`;

}


// ========================================
// Filter
// ========================================

function applyFilter() {

    const selectedCategory =
        filterCategory.value;


    if (selectedCategory === "All") {

        renderTable(allExpenses);

        renderSummary();

        return;

    }


    const filteredExpenses =
        allExpenses.filter(
            function (expense) {

                return expense.category === selectedCategory;

            }
        );


    renderTable(filteredExpenses);


    // Summary remains based on ALL expenses
    renderSummary();

}


// ========================================
// Validation
// ========================================

function validateExpense(
    title,
    amount,
    category,
    date
) {

    if (title.trim() === "") {

        showAlert(
            "Please enter an expense title."
        );

        return false;

    }


    if (
        amount === "" ||
        Number(amount) <= 0
    ) {

        showAlert(
            "Amount must be greater than 0."
        );

        return false;

    }


    if (category === "") {

        showAlert(
            "Please choose a category."
        );

        return false;

    }


    if (date === "") {

        showAlert(
            "Please choose a date."
        );

        return false;

    }


    return true;

}


// ========================================
// Add Expense Form
// ========================================

expenseForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const title =
            titleInput.value;

        const amount =
            amountInput.value;

        const category =
            categoryInput.value;

        const date =
            dateInput.value;


        if (
            !validateExpense(
                title,
                amount,
                category,
                date
            )
        ) {

            return;

        }


        const data = {

            title: title.trim(),

            amount: Number(amount),

            category: category,

            date: date

        };


        const success =
            await addExpense(data);


        if (success) {

            expenseForm.reset();

            await refresh();

        }

    }
);


// ========================================
// Delete Handler
// ========================================

async function handleDelete(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmed) {

        return;

    }


    const success =
        await deleteExpense(id);


    if (success) {

        await refresh();

    }

}


// ========================================
// Edit Modal
// ========================================

function openEditModal(id) {

    const expense =
        allExpenses.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!expense) {

        showAlert(
            "Expense not found."
        );

        return;

    }


    const modalHTML = `

        <div
            class="modal fade"
            id="editExpenseModal"
            tabindex="-1"
        >

            <div class="modal-dialog">

                <div class="modal-content">


                    <div class="modal-header">

                        <h5 class="modal-title">
                            Edit Expense
                        </h5>


                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                        ></button>

                    </div>


                    <div class="modal-body">

                        <form id="editExpenseForm">


                            <div class="mb-3">

                                <label
                                    for="editTitle"
                                    class="form-label"
                                >
                                    Title
                                </label>


                                <input
                                    type="text"
                                    id="editTitle"
                                    class="form-control"
                                    value="${expense.title}"
                                >

                            </div>


                            <div class="mb-3">

                                <label
                                    for="editAmount"
                                    class="form-label"
                                >
                                    Amount
                                </label>


                                <input
                                    type="number"
                                    id="editAmount"
                                    class="form-control"
                                    value="${expense.amount}"
                                    step="0.01"
                                >

                            </div>


                            <div class="mb-3">

                                <label
                                    for="editCategory"
                                    class="form-label"
                                >
                                    Category
                                </label>


                                <select
                                    id="editCategory"
                                    class="form-select"
                                >

                                    <option value="Food">
                                        Food
                                    </option>

                                    <option value="Transport">
                                        Transport
                                    </option>

                                    <option value="Bills">
                                        Bills
                                    </option>

                                    <option value="Entertainment">
                                        Entertainment
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            <div class="mb-3">

                                <label
                                    for="editDate"
                                    class="form-label"
                                >
                                    Date
                                </label>


                                <input
                                    type="date"
                                    id="editDate"
                                    class="form-control"
                                    value="${expense.date}"
                                >

                            </div>


                            <button
                                type="submit"
                                class="btn btn-primary"
                            >
                                Save Changes
                            </button>


                        </form>

                    </div>

                </div>

            </div>

        </div>

    `;


    const oldModal =
        document.getElementById(
            "editExpenseModal"
        );


    if (oldModal) {

        oldModal.remove();

    }


    document.body.insertAdjacentHTML(
        "beforeend",
        modalHTML
    );


    document.getElementById(
        "editCategory"
    ).value = expense.category;


    const modalElement =
        document.getElementById(
            "editExpenseModal"
        );


    const modal =
        new bootstrap.Modal(
            modalElement
        );


    modal.show();


    const editForm =
        document.getElementById(
            "editExpenseForm"
        );


    editForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const title =
                document.getElementById(
                    "editTitle"
                ).value;


            const amount =
                document.getElementById(
                    "editAmount"
                ).value;


            const category =
                document.getElementById(
                    "editCategory"
                ).value;


            const date =
                document.getElementById(
                    "editDate"
                ).value;


            if (
                !validateExpense(
                    title,
                    amount,
                    category,
                    date
                )
            ) {

                return;

            }


            const data = {

                title: title.trim(),

                amount: Number(amount),

                category: category,

                date: date

            };


            const success =
                await updateExpense(
                    id,
                    data
                );


            if (success) {

                modal.hide();

                await refresh();

            }

        }
    );

}


// ========================================
// Filter Change
// ========================================

filterCategory.addEventListener(
    "change",
    function () {

        applyFilter();

    }
);


// ========================================
// Start Application
// ========================================

refresh();
