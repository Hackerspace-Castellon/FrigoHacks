<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product List</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1 {
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid black;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f4f4f4;
        }
        @media print {
            button {
                display: none;
            }
        }
    </style>
</head>
<body>

    <h1>Product List</h1>

    <button onclick="window.print()">Print</button>

    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Price (€)</th>
                <th>Code (ID)</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($products as $product)
                <tr>
                    <td>{{ $product->name }}</td>
                    <td>{{ number_format($product->price, 2) }}</td>
                    <td>{{ sprintf('%02d', $product->id) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
