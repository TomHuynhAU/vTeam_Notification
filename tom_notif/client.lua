RegisterNetEvent("tNotif:show")
AddEventHandler("tNotif:show", function(data)
    SendNUIMessage({
        action = "showNotification",
        type = data.type or "information",
        title = data.title or "Thông báo",
        message = data.message or "",
        buttons = data.buttons or {},
        duration = data.duration or 5
    })
end)



TriggerEvent("tNotif:show", {
    type = "success",
    title = "Thành công",
    message = "Bạn đã hoàn thành nhiệm vụ!",
    buttons = {
        { label = "Xem chi tiết", id = "details", data = "https://gtastreet.com" },
        { label = "Đóng", id = "close", data = "close" }
    }
})

RegisterNUICallback("interaction", function(data, cb)
    print("[Notification Clicked]", data.buttonid, data.data)
    -- xử lý tiếp tùy logic bạn muốn
    cb({})
end)

local isCursorVisible = false

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)

        -- Alt toggle cursor
        if IsControlJustPressed(0, 19) then -- ALT
            isCursorVisible = not isCursorVisible
            SetNuiFocus(isCursorVisible, isCursorVisible)
        end
    end
end)

-- Nhận từ JS khi muốn tắt focus
RegisterNUICallback("focus", function(data, cb)
    if data.state == false then
        isCursorVisible = false
        SetNuiFocus(false, false)
    end
    cb({})
end)

