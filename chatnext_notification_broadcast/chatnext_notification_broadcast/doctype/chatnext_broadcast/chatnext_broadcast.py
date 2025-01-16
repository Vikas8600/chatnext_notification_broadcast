# Copyright (c) 2025, Hybrowlabs and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import getdate, today

class ChatnextBroadcast(Document):
    pass



def get_today_birthdays():
    frappe.logger("chatnext_notification_broadcast").error("Running get_today_birthdays")
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

def create_broadcast_for_employee(doc):
    chatnext_broadcast = frappe.new_doc("Chatnext Broadcast")
    chatnext_broadcast.event_doctype = "Employee"
    chatnext_broadcast.docname = doc.name
    chatnext_broadcast.message = get_birthday_message()
    chatnext_broadcast.save()

def get_birthday_message():
    birthday_message = frappe.db.get_value("Chatnext Notification", {"type": "Birthday"}, "name")
    return birthday_message