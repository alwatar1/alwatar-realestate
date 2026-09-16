'use client';

import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  function update(key: string, value: any) {
    setSettings((old: any) => ({
      ...old,
      [key]: value,
    }));
  }

  async function uploadImage(
    e: any,
    key: 'logoUrl' | 'heroImageUrl'
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(key);
    setMessage('');

    const formData = new FormData();
    formData.append('files', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.urls?.[0]) {
        setMessage(
          data.error || 'فشل رفع الصورة'
        );
        return;
      }

      update(key, data.urls[0]);

      setMessage(
        key === 'logoUrl'
          ? 'تم رفع الشعار، اضغط حفظ لتثبيته.'
          : 'تم رفع صورة الواجهة، اضغط حفظ لتثبيتها.'
      );
    } catch {
      setMessage('حدث خطأ أثناء رفع الصورة');
    } finally {
      setUploading('');
      e.target.value = '';
    }
  }

  async function save() {
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage(
          'تم حفظ التغييرات بنجاح ✓'
        );
      } else {
        const data = await res.json().catch(() => null);

        setMessage(
          data?.error ||
            'حدث خطأ أثناء الحفظ'
        );
      }
    } catch {
      setMessage('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <p>جارٍ تحميل الإعدادات...</p>
        </div>
      </main>
    );
  }

  if (!settings) {
    return (
      <main className="section">
        <div className="container">
          <p>تعذر تحميل الإعدادات.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div
        className="container"
        style={{ maxWidth: 900 }}
      >
        <div className="panel">

          <h1>تخصيص الواجهة</h1>

          <p className="muted">
            تحكم كامل في محتوى وشكل الموقع من هنا.
          </p>

          <hr style={{ margin: '25px 0' }} />

          {/* الهوية */}

          <h2>الهوية</h2>

          <label>اسم المكتب</label>

          <input
            className="field"
            style={{
              width: '100%',
              margin: '6px 0 18px',
            }}
            value={settings.siteName || ''}
            onChange={(e) =>
              update(
                'siteName',
                e.target.value
              )
            }
          />

          <div
            style={{
              marginBottom: 25,
              padding: 18,
              border: '1px solid #ddd',
              borderRadius: 14,
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              شعار المكتب
            </h3>

            {settings.logoUrl && (
              <div
                style={{
                  marginBottom: 15,
                }}
              >
                <img
                  src={settings.logoUrl}
                  alt="شعار المكتب"
                  style={{
                    maxWidth: 220,
                    maxHeight: 120,
                    objectFit: 'contain',
                    borderRadius: 10,
                    display: 'block',
                    background: '#f5f5f5',
                    padding: 10,
                  }}
                />
              </div>
            )}

            <label>
              رفع شعار جديد
            </label>

            <input
              type="file"
              accept="image/*"
              style={{
                display: 'block',
                marginTop: 8,
              }}
              disabled={uploading === 'logoUrl'}
              onChange={(e) =>
                uploadImage(
                  e,
                  'logoUrl'
                )
              }
            />

            {uploading === 'logoUrl' && (
              <p className="muted">
                جارٍ رفع الشعار...
              </p>
            )}

            {settings.logoUrl && (
              <button
                type="button"
                className="btn"
                style={{
                  marginTop: 10,
                }}
                onClick={() =>
                  update(
                    'logoUrl',
                    ''
                  )
                }
              >
                حذف الشعار
              </button>
            )}
          </div>

          {/* الواجهة */}

          <h2>الواجهة الرئيسية</h2>

          <label>العنوان الرئيسي</label>

          <input
            className="field"
            style={{
              width: '100%',
              margin: '6px 0 18px',
            }}
            value={settings.headline || ''}
            onChange={(e) =>
              update(
                'headline',
                e.target.value
              )
            }
          />

          <label>العنوان الفرعي</label>

          <input
            className="field"
            style={{
              width: '100%',
              margin: '6px 0 18px',
            }}
            value={
              settings.subheadline || ''
            }
            onChange={(e) =>
              update(
                'subheadline',
                e.target.value
              )
            }
          />

          <label>الوصف</label>

          <textarea
            className="field"
            style={{
              width: '100%',
              minHeight: 120,
              margin: '6px 0 18px',
            }}
            value={
              settings.description || ''
            }
            onChange={(e) =>
              update(
                'description',
                e.target.value
              )
            }
          />

          {/* صورة الواجهة */}

          <div
            style={{
              marginBottom: 25,
              padding: 18,
              border: '1px solid #ddd',
              borderRadius: 14,
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              صورة الواجهة الرئيسية
            </h3>

            {settings.heroImageUrl && (
              <div
                style={{
                  marginBottom: 15,
                }}
              >
                <img
                  src={settings.heroImageUrl}
                  alt="صورة الواجهة الرئيسية"
                  style={{
                    width: '100%',
                    maxHeight: 350,
                    objectFit: 'cover',
                    borderRadius: 14,
                    display: 'block',
                  }}
                />
              </div>
            )}

            <label>
              رفع صورة جديدة للواجهة
            </label>

            <input
              type="file"
              accept="image/*"
              style={{
                display: 'block',
                marginTop: 8,
              }}
              disabled={
                uploading ===
                'heroImageUrl'
              }
              onChange={(e) =>
                uploadImage(
                  e,
                  'heroImageUrl'
                )
              }
            />

            {uploading ===
              'heroImageUrl' && (
              <p className="muted">
                جارٍ رفع الصورة...
              </p>
            )}

            {settings.heroImageUrl && (
              <button
                type="button"
                className="btn"
                style={{
                  marginTop: 10,
                }}
                onClick={() =>
                  update(
                    'heroImageUrl',
                    ''
                  )
                }
              >
                حذف صورة الواجهة
              </button>
            )}
          </div>

          {/* الأزرار */}

          <h2>الأزرار</h2>

          <label>
            نص الزر الرئيسي
          </label>

          <input
            className="field"
            style={{
              width: '100%',
              margin: '6px 0 18px',
            }}
            value={
              settings.primaryButtonText ||
              ''
            }
            onChange={(e) =>
              update(
                'primaryButtonText',
                e.target.value
              )
            }
          />

          <label>
            رابط الزر الرئيسي
          </label>

          <input
            className="field"
            style={{
              width: '100%',
              margin: '6px 0 18px',
            }}
            value={
              settings.primaryButtonUrl ||
              ''
            }
            onChange={(e) =>
              update(
                'primaryButtonUrl',
                e.target.value
              )
            }
          />

          <label>
            نص الزر الثاني
          </label>

          <input
            className="field"
            style={{
              width: '100%',
              margin: '6px 0 18px',
            }}
            value={
              settings.secondaryButtonText ||
              ''
            }
            onChange={(e) =>
              update(
                'secondaryButtonText',
                e.target.value
              )
            }
          />

          <label>
            رابط الزر الثاني
          </label>

          <input
            className="field"
            style={{
              width: '100%',
              margin: '6px 0 18px',
            }}
            value={
              settings.secondaryButtonUrl ||
              ''
            }
            onChange={(e) =>
              update(
                'secondaryButtonUrl',
                e.target.value
              )
            }
          />

          {/* التواصل */}

          <h2>التواصل</h2>

          {[
            ['phone', 'رقم الجوال'],
            ['whatsapp', 'رقم الواتساب'],
            ['email', 'البريد الإلكتروني'],
            ['address', 'عنوان المكتب'],
            [
              'mapUrl',
              'رابط الموقع على الخريطة',
            ],
          ].map(([key, label]) => (
            <div key={key}>
              <label>{label}</label>

              <input
                className="field"
                style={{
                  width: '100%',
                  margin:
                    '6px 0 18px',
                }}
                value={
                  settings[key] || ''
                }
                onChange={(e) =>
                  update(
                    key,
                    e.target.value
                  )
                }
              />
            </div>
          ))}

          {/* الألوان */}

          <h2>الألوان</h2>

          <div className="formgrid">

            <div>
              <label>
                اللون الأساسي
              </label>

              <input
                type="color"
                value={
                  settings.primaryColor ||
                  '#b8954a'
                }
                onChange={(e) =>
                  update(
                    'primaryColor',
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label>
                اللون الثانوي
              </label>

              <input
                type="color"
                value={
                  settings.secondaryColor ||
                  '#111111'
                }
                onChange={(e) =>
                  update(
                    'secondaryColor',
                    e.target.value
                  )
                }
              />
            </div>

          </div>

          {/* الأقسام */}

          <h2>
            أقسام الصفحة الرئيسية
          </h2>

          {[
            [
              'showFeatured',
              'العقارات المميزة',
            ],
            [
              'showNeighborhoods',
              'الأحياء',
            ],
            [
              'showAbout',
              'من نحن',
            ],
            [
              'showContact',
              'التواصل',
            ],
          ].map(([key, label]) => (
            <label
              key={key}
              style={{
                display: 'block',
                margin: '12px 0',
              }}
            >
              <input
                type="checkbox"
                checked={!!settings[key]}
                onChange={(e) =>
                  update(
                    key,
                    e.target.checked
                  )
                }
              />{' '}
              {label}
            </label>
          ))}

          {/* الفوتر */}

          <h2>الفوتر</h2>

          <textarea
            className="field"
            style={{
              width: '100%',
              minHeight: 100,
              margin:
                '6px 0 18px',
            }}
            value={
              settings.footerText || ''
            }
            onChange={(e) =>
              update(
                'footerText',
                e.target.value
              )
            }
            placeholder="النص الذي يظهر أسفل الموقع"
          />

          {/* التواصل الاجتماعي */}

          <h2>
            التواصل الاجتماعي
          </h2>

          {[
            ['instagram', 'Instagram'],
            ['snapchat', 'Snapchat'],
            ['tiktok', 'TikTok'],
          ].map(([key, label]) => (
            <div key={key}>
              <label>{label}</label>

              <input
                className="field"
                style={{
                  width: '100%',
                  margin:
                    '6px 0 18px',
                }}
                value={
                  settings[key] || ''
                }
                onChange={(e) =>
                  update(
                    key,
                    e.target.value
                  )
                }
              />
            </div>
          ))}

          {/* الحفظ */}

          <button
            type="button"
            className="btn gold"
            onClick={save}
            disabled={saving}
            style={{
              marginTop: 15,
            }}
          >
            {saving
              ? 'جارٍ الحفظ...'
              : 'حفظ جميع التغييرات'}
          </button>

          {message && (
            <div
              className="notice"
              style={{
                marginTop: 15,
              }}
            >
              {message}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}