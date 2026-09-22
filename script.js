document.addEventListener('DOMContentLoaded', function () {
    let balance = 5234.56;
    const balanceElement = document.getElementById('balance-amount');
    const transactionList = document.getElementById('transaction-list');

    // Update balance display
    function updateBalance() {
        balanceElement.textContent = `$${balance.toFixed(2)}`;
    }

    // Add transaction to list
    function addTransaction(description, amount, date) {
        const li = document.createElement('li');
        li.textContent = `${description} - $${amount.toFixed(2)} - ${date}`;
        transactionList.insertBefore(li, transactionList.firstChild);
    }

    // Button event listeners
    document.getElementById('add-income').addEventListener('click', function () {
        const amount = parseFloat(prompt('Enter income amount:'));
        if (!isNaN(amount) && amount > 0) {
            balance += amount;
            updateBalance();
            addTransaction('Income', amount, 'Today');
        }
    });

    document.getElementById('add-expense').addEventListener('click', function () {
        const amount = parseFloat(prompt('Enter expense amount:'));
        if (!isNaN(amount) && amount > 0) {
            balance -= amount;
            updateBalance();
            addTransaction('Expense', -amount, 'Today');
        }
    });

    document.getElementById('transfer').addEventListener('click', function () {
        const amount = parseFloat(prompt('Enter transfer amount:'));
        if (!isNaN(amount) && amount > 0 && amount <= balance) {
            balance -= amount;
            updateBalance();
            addTransaction('Transfer', -amount, 'Today');
        } else {
            alert('Invalid transfer amount');
        }
    });

    // Simple chart drawing
    const canvas = document.getElementById('spending-chart');
    const ctx = canvas.getContext('2d');

    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Sample data
        const data = [200, 150, 300, 100, 250, 180, 220];
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        const barWidth = 40;
        const barSpacing = 20;
        const maxValue = Math.max(...data);

        ctx.fillStyle = '#3498db';
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * 150;
            const x = index * (barWidth + barSpacing) + 20;
            const y = canvas.height - barHeight - 20;

            ctx.fillRect(x, y, barWidth, barHeight);

            // Label
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(labels[index], x + barWidth / 2, canvas.height - 5);
            ctx.fillStyle = '#3498db';
        });
    }

    drawChart();

    // Initial balance update
    updateBalance();
});