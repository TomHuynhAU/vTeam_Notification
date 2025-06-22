RegisterCommand("thongbaonut", function(source, args, rawCommand)
    local parsed = {}
    for quoted in rawCommand:gmatch('"([^"]+)"') do
        table.insert(parsed, quoted)
    end

    -- Lấy các giá trị được truyền
    local type = args[1] or "information"
    local title = parsed[1] or "Thông báo"
    local message = parsed[2] or "Nội dung mặc định"
    local duration = tonumber(args[#args - 2]) or 5
    local btn1 = args[#args - 1]
    local btn2 = args[#args]

    -- Xử lý nút
    local buttons = {}
    if btn1 then
        table.insert(buttons, { label = btn1, id = "btn1", data = btn1 })
    end
    if btn2 and btn2 ~= btn1 then
        table.insert(buttons, { label = btn2, id = "btn2", data = btn2 })
    end

    -- Gửi thông báo
    TriggerClientEvent("tNotif:show", source, {
        type = type,
        title = title,
        message = message,
        buttons = buttons,
        duration = duration
    })
end)

RegisterCommand("thongbao", function(source, args, rawCommand)
    local parsed = {}
    for quoted in rawCommand:gmatch('"([^"]+)"') do
        table.insert(parsed, quoted)
    end

    -- Lấy duration (số cuối cùng)
    local duration = tonumber(rawCommand:match('(%d+)%s*$')) or 5

    -- Kiểm tra hợp lệ
    if #parsed < 3 then
        print("❌ Sai cú pháp. Dùng: /thongbao \"lsfd\" \"Tiêu đề\" \"Nội dung\" 6")
        return
    end

    -- Lấy thông tin từ parsed
    local notifType = parsed[1]
    local title = parsed[2]
    local message = parsed[3]

    TriggerClientEvent("tNotif:show", source == 0 and -1 or source, {
        type = notifType,
        title = title,
        message = message,
        duration = duration
    })
end, true)
