/**
 * DOM fixture builders that replace the XML/HTML fixture loading used by jsdom tests.
 * Instead of parsing XML files, these functions build DOM trees programmatically
 * using createElement/appendChild/setAttribute.
 */

/**
 * Creates a "staff" document structure similar to the staff.xml fixture.
 * Contains 5 employee elements, each with employeeId, name, position, salary, gender, address children.
 */
export function createStaffFixture() {
  const staff = document.createElement('staff')

  const employees = [
    {
      employeeId: 'EMP0001',
      name: 'Margaret Martin',
      position: 'Accountant',
      salary: '56,000',
      gender: 'Female',
      address: { domestic: 'Yes', street: 'Yes' }
    },
    {
      employeeId: 'EMP0002',
      name: 'Martha Raynolds',
      position: 'Secretary',
      salary: '35,000',
      gender: 'Female',
      address: { domestic: 'Yes', street: 'Yes' }
    },
    {
      employeeId: 'EMP0003',
      name: 'Roger Jones',
      position: 'Department Manager',
      salary: '100,000',
      gender: 'Male',
      address: { domestic: 'Yes', street: 'No' }
    },
    {
      employeeId: 'EMP0004',
      name: 'Jeny Oconnor',
      position: 'Open Area Technician',
      salary: '95,000',
      gender: 'Female',
      address: { domestic: 'Yes', street: 'Y&ent1;' }
    },
    {
      employeeId: 'EMP0005',
      name: 'Robert Myers',
      position: 'Computer Specialist',
      salary: '90,000',
      gender: 'male',
      address: { domestic: 'Yes', street: 'Yes' }
    }
  ]

  const employeeElements: Element[] = []
  const addressElements: Element[] = []

  for (const emp of employees) {
    const employee = document.createElement('employee')

    const employeeId = document.createElement('employeeId')
    employeeId.appendChild(document.createTextNode(emp.employeeId))
    employee.appendChild(employeeId)

    const name = document.createElement('name')
    name.appendChild(document.createTextNode(emp.name))
    employee.appendChild(name)

    const position = document.createElement('position')
    position.appendChild(document.createTextNode(emp.position))
    employee.appendChild(position)

    const salary = document.createElement('salary')
    salary.appendChild(document.createTextNode(emp.salary))
    employee.appendChild(salary)

    const gender = document.createElement('gender')
    gender.appendChild(document.createTextNode(emp.gender))
    employee.appendChild(gender)

    const address = document.createElement('address')
    address.setAttribute('domestic', emp.address.domestic)
    address.setAttribute('street', emp.address.street)
    employee.appendChild(address)

    staff.appendChild(employee)
    employeeElements.push(employee)
    addressElements.push(address)
  }

  document.body.appendChild(staff)

  return { staff, employeeElements, addressElements }
}

/**
 * Creates an element with the given tag and attributes, appended to document.body.
 */
export function createElement(tag: string, attrs?: Record<string, string>, children?: (Element | Text)[]): Element {
  const el = document.createElement(tag)
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value)
    }
  }
  if (children) {
    for (const child of children) {
      el.appendChild(child)
    }
  }
  return el
}

/**
 * Creates a text node with the given content.
 */
export function text(content: string): Text {
  return document.createTextNode(content)
}

/**
 * Builds a simple element tree and attaches it to document.body.
 * Returns the root element.
 */
export function buildTree(tag: string, attrs?: Record<string, string>, children?: Array<{ tag: string, attrs?: Record<string, string>, text?: string }>): Element {
  const root = createElement(tag, attrs)
  if (children) {
    for (const childDef of children) {
      const child = createElement(childDef.tag, childDef.attrs)
      if (childDef.text) {
        child.appendChild(text(childDef.text))
      }
      root.appendChild(child)
    }
  }
  document.body.appendChild(root)
  return root
}
