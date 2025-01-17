# Copyright (c) 2025, Hybrowlabs and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import getdate, today

class EventBroadcast(Document):
    pass



def get_today_birthdays():
    try:
        """Fetch all employees with birthdays today."""
        today_date = getdate(today())  # Fetch today's date
        
        # Query the Employee Doctype for matching birth dates
        employees_with_birthdays = frappe.get_all(
            'Employee',
            filters={'date_of_birth': today_date},
            fields=['name', 'employee_name', 'date_of_birth', 'company', 'department']
        )
        for employee in employees_with_birthdays:
            create_broadcast_for_employee(employee)
        return
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "event_notification")

def create_broadcast_for_employee(doc):
    event_broadcast = frappe.new_doc("Event Broadcast")
    event_broadcast.event_doctype = "Employee"
    event_broadcast.docname = doc.name
    event_broadcast.message = get_birthday_message()
    event_broadcast.save()

def get_birthday_message():
    birthday_message = frappe.db.get_value("Event Notification", {"type": "Birthday"}, "name")
    return birthday_message