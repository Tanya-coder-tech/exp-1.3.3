$ErrorActionPreference = "Stop"

function Test-Endpoint {
    param(
        [string]$Uri,
        [string]$Method = "Get",
        [string]$Token = $null,
        [object]$Body = $null,
        [string]$Description
    )

    Write-Host "Testing: $Description" -NoNewline
    
    $Headers = @{}
    if ($Token) {
        $Headers["Authorization"] = $Token
    }

    try {
        $Params = @{
            Uri = $Uri
            Method = $Method
            ContentType = "application/json"
            Headers = $Headers
        }
        if ($Body) {
            $Params["Body"] = ($Body | ConvertTo-Json)
        }

        $Response = Invoke-RestMethod @Params
        Write-Host " [SUCCESS]" -ForegroundColor Green
        return $Response
    } catch {
        Write-Host " [FAILED] - $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
             # Read the response stream if available
             $Stream = $_.Exception.Response.GetResponseStream()
             $Reader = New-Object System.IO.StreamReader($Stream)
             $Body = $Reader.ReadToEnd()
             Write-Host "Response Body: $Body" -ForegroundColor Yellow
        }
        return $null
    }
}

# 0. Test Root
Test-Endpoint -Uri "http://127.0.0.1:5000/" -Method Get -Description "Root Route"

# 0.1 Test Auth Route
Test-Endpoint -Uri "http://127.0.0.1:5000/api/auth/test" -Method Get -Description "Test Auth Route"

# 1. Register Admin
$AdminUser = @{
    username = "admin_user_$(Get-Random)"
    email = "admin_$(Get-Random)@test.com"
    password = "password123"
    role = "admin"
}
Test-Endpoint -Uri "http://127.0.0.1:5000/api/auth/register" -Method Post -Body $AdminUser -Description "Register Admin"

# 2. Login Admin
$LoginBody = @{
    email = $AdminUser.email
    password = $AdminUser.password
}
$AdminLogin = Test-Endpoint -Uri "http://127.0.0.1:5000/api/auth/login" -Method Post -Body $LoginBody -Description "Login Admin"
$AdminToken = $AdminLogin.token

# 3. Access Admin Route (As Admin)
Test-Endpoint -Uri "http://127.0.0.1:5000/api/admin" -Token $AdminToken -Description "Access Admin Route (As Admin)"

# 4. Access User Dashboard (As Admin)
Test-Endpoint -Uri "http://127.0.0.1:5000/api/dashboard" -Token $AdminToken -Description "Access User Dashboard (As Admin)"

# 5. Register Regular User
$RegularUser = @{
    username = "regular_user_$(Get-Random)"
    email = "user_$(Get-Random)@test.com"
    password = "password123"
    role = "user"
}
Test-Endpoint -Uri "http://127.0.0.1:5000/api/auth/register" -Method Post -Body $RegularUser -Description "Register Regular User"

# 6. Login Regular User
$UserLoginBody = @{
    email = $RegularUser.email
    password = $RegularUser.password
}
$UserLogin = Test-Endpoint -Uri "http://127.0.0.1:5000/api/auth/login" -Method Post -Body $UserLoginBody -Description "Login Regular User"
$UserToken = $UserLogin.token

# 7. Access Admin Route (As User) - SHOULD FAIL
Write-Host "Testing: Access Admin Route (As User) - SHOULD FAIL" -NoNewline
try {
    Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/admin" -Method Get -Headers @{ Authorization = $UserToken }
    Write-Host " [FAILED] - Endpoint was accessible!" -ForegroundColor Red
} catch {
    Write-Host " [SUCCESS] - Access Denied as expected ($($_.Exception.Message))" -ForegroundColor Green
}

# 8. Access User Dashboard (As User)
Test-Endpoint -Uri "http://127.0.0.1:5000/api/dashboard" -Token $UserToken -Description "Access User Dashboard (As User)"
