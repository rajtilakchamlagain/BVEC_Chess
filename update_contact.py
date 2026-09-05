import re

def update_profile_page():
    path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ProfilePage.jsx"
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update formData initial state
    content = content.replace(
        "bio: '',",
        "bio: '',\n    contactNumber: '',\n    contactType: 'Phone Only',"
    )
    
    # 2. Add input fields to the form
    input_fields = """
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Contact Number *</label>
              <input
                type="text"
                placeholder="e.g. +91 9876543210"
                value={formData.contactNumber}
                onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                required
              />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Number Type *</label>
              <select
                value={formData.contactType}
                onChange={e => setFormData({ ...formData, contactType: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
              >
                <option value="Phone Only">Phone Only</option>
                <option value="WhatsApp Only">WhatsApp Only</option>
                <option value="Both Phone & WhatsApp">Both Phone & WhatsApp</option>
              </select>
            </div>
          </div>
"""
    # Insert right before the Branch/Year inputs
    content = content.replace(
        "<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>\n            <div style={{ flex: 1, minWidth: '200px' }}>\n              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Branch</label>",
        input_fields + "\n          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>\n            <div style={{ flex: 1, minWidth: '200px' }}>\n              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Branch</label>"
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


def update_player_entry():
    path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessPlayerEntry.jsx"
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update playerData state
    content = content.replace(
        "bio: ''",
        "bio: '',\n    contactNumber: '',\n    contactType: 'Phone Only'"
    )
    
    # 2. Update validation to require contact number
    content = content.replace(
        "if (!playerData.name.trim())",
        "if (!playerData.name.trim() || !playerData.contactNumber.trim()) {\n        alert('Please provide your name and contact number.');\n        return;\n      }\n      if (!playerData.name.trim())"
    )

    # 3. Add fields to UI form (Step 2)
    input_fields = """
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Contact Number *</label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={playerData.contactNumber}
                  onChange={e => setPlayerData({...playerData, contactNumber: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                  required
                />
              </div>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Number Type *</label>
                <select
                  value={playerData.contactType}
                  onChange={e => setPlayerData({...playerData, contactType: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                >
                  <option value="Phone Only">Phone Only</option>
                  <option value="WhatsApp Only">WhatsApp Only</option>
                  <option value="Both Phone & WhatsApp">Both Phone & WhatsApp</option>
                </select>
              </div>
            </div>
"""
    content = content.replace(
        "onChange={e => setPlayerData({...playerData, rollNumber: e.target.value})}\n                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}\n              />\n            </div>\n          </div>",
        "onChange={e => setPlayerData({...playerData, rollNumber: e.target.value})}\n                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}\n              />\n            </div>\n          </div>\n" + input_fields
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

update_profile_page()
update_player_entry()
print("Updated ProfilePage and ChessPlayerEntry")
